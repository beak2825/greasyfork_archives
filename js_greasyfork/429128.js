// ==UserScript==
// @name         AfreecaTV_Manager
// @namespace    AfreecaTV_Manager
// @version      1.45
// @description  AfreecaTV manager plugin for web player
// @author       darkyop
// @match        *://play.afreecatv.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js
// @require     https://static.afreecatv.com/asset/library/requirejs/2.1.8/require.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429128/AfreecaTV_Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/429128/AfreecaTV_Manager.meta.js
// ==/UserScript==

var serverUrl = "mngr.afreehp.kr";
var nodeServer = "mngr.afreehp.kr";
var page = {
    debug: false,
    io:null,
    $:null,
    log: {
        debug: false,
        info: false,
        callscript: false,
        msg: false
    },
    opt: {
        idx:0,
        loadcheck: false,
        socket: null,
        socketip: location.protocol !== 'https:' ? nodeServer+":13538" : "wss://"+nodeServer+":14536",
        //mainlist:["short", "info", "gift", "report", "join", "greet", "answer", "dumb", "kick", "macro"]
        mainlist: ["gift", "report", "join", "greet", "up", "answer", "macro"],
        maincheck: true,
        sublist: ["short", "info"],
        subcheck: true,
        joinlist: {},
        prevmacro: {},
        giftcontinue: false
    },
    info: {
        search:false,
        searchid:"",
        searchnick:"",
        connect: false,
        use:false,
        key:"",
        idx:"",
        bjid:"",
        flag:0,
        id:"",
        sid:"",
        nid:"",
        detail: { title:"", start:"", view:0 },
        statstime:10000,
        up:{
            load:false,
            day:0,
            total:0,
            today:0,
            list:{},
            recent:[]
        },
        uptime:10000
    },
    filter:{
        word:"",
        answer:[],
        dumb:[],
        kick:[]
    },
    data: {},
    init: function() {
        if(typeof liveView === "object" && typeof livePlayer === "object" && liveView.LiveViewInfo !== undefined && liveView.LiveViewInfo.nBroadNo !== undefined && liveView.LiveViewInfo.nBroadNo > 0) {
            
            $("#chat_area").append('<p class="mngr_prev_warn" style="padding:5px;margin:5px;line-height:20px;font-size:14px;color:#fff;font-weight:700;background:#2c84ce;">기존 매니저도우미는 곧 서비스가 종료될 예정입니다. <a href="https://bj.afreecatv.com/darkyop/post/114415279" target="_blank" style="color:#fff;font-size:16px;font-weight:700;text-decoration:underline;">링크</a>를 참고하여 새로운 채팅매니저를 이용해주세요.</p>');
            $("#chat_area .box_Vstart").removeClass("warn");
            
            //css 로드
            page.css();

            //함수 오버라이드
            page.funcadd();

            doTimeout("mngr_join", function() {
                page.start();
            }, 5000);
        }
        else {
            setTimeout(function() {
                page.init();
            }, 1000);
        }
    },
    css: function() {

        var addCss = document.createElement('link');
        addCss.href = 'https://mngr.afreehp.kr/mngr/css.php?time=' + new Date().getTime();
        addCss.type = 'text/css';
        addCss.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(addCss);

        var addCss = document.createElement('link');
        addCss.href = '//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css';
        addCss.type = 'text/css';
        addCss.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(addCss);

        var addCss = document.createElement('link');
        addCss.href = 'https://afreehp.kr/resource/css/vendor/fonts.css';
        addCss.type = 'text/css';
        addCss.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(addCss);
    },

    //접속시작
    start: function() {
        doTimeout("mngr_join", false);

        //스타일 설정
        page.style.init();

        if(!page.isLogin()) {
            return;
        }

        if(page.info.bjid === "") {
            if(page.log.debug) console.log(liveView.LiveViewInfo.szBjId, liveView.LiveViewInfo.nBroadNo);
            page.info.bjid = page.getid(liveView.LiveViewInfo.szBjId);
            page.info.id = page.getid(liveView.ChatInfo.myUserInfo.szUserId);
            page.info.nid = liveView.LiveViewInfo.nBroadNo;
        }

        if(page.info.connect === true) return;
        page.info.connect = true;

        //소켓
        page.connect();

        //상태
        page.stats();

        //로딩
        page.load();

        //히스토리 내역 초기화
        page.history.init();

        //갈고리
        page.galgori.init();

        //명령어 툴
        page.cmdtool.init();
    },
    mngrload: function() {
        doTimeout("manager_load", function() {
            if(page.isManager()) {
                if(page.log.debug) console.log("manager_load");
                page.start();
                page.noticeClose();

                var getMngMenu = page.getCookie("player_menu_manager");
                if(getMngMenu == "off") {
                    $("#layer_mchat .btn_close").trigger("click");
                }
                if(!page.isSocket()) {
                    page.reconnect();
                    $("#add_menu_check").prop("checked", true).trigger("change");
                }
                $("#chatting_area").removeClass("mngr_non");
                page.style.managerResize();

                liveView.Chat.setManager(1);
            }
            else {
                $("#chatting_area").removeClass("manager");
                $("#chatting_area").addClass("mngr_non");
                // if(page.isSocket()) {
                // page.socket.close();
                // }
                //$("#add_menu_check").prop("checked", false).trigger("change");
                liveView.Chat.setManager(0);
            }
        }, 500);
    },
    mngrcheck: function() {
        doTimeout("manager_check", function() {
            if(page.isLogin()) {
                page.start();
            }
            else {
                // if(page.isSocket()) {
                // page.socket.close();
                // $("#add_menu_check").prop("checked", false).trigger("change");
                // }
                //$("#add_menu_check").prop("checked", false).trigger("change");
            }
            page.info.use = page.isUse();
            page.mngrcheck();

            // if(page.info.use && page.isManager()) $("#chatting_area").removeClass("mngr_hide");
            // else $("#chatting_area").addClass("mngr_hide");
        }, 1000);
    },

    //소켈
    connect: function() {
        if(!page.isLogin()) return;

        //DISCRIPTION :: 'css!//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', 'css!http://afreehp.kr/afreecahelper/css/fonts.css'
        //CSS 로드가 안되서 제거 했습니다.
        page.io = io;

        var socket = page.io.connect(page.opt.socketip,{
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: page.randomRange(300, 600) * 10
        });
        page.socket = socket;

        socket.on("connect", function(data) {
            if(page.log.debug) console.log("mngr socket connect", data);
            socket.emit("mngr", { type:"player", id:page.info.id, bjid:page.info.bjid });
        });

        socket.on("id", function(data) {
            if(page.log.debug) console.log("mngr socket id", data);
            if(data && data.key != undefined && data.idx != undefined && data.key !== "" && data.idx !== "") {
                page.info.key = data.key;
                page.info.idx = data.idx;
                $("#mngr_menu .btn_addmenu_setup").removeAttr("onclick").attr("href", "https://mngr.afreehp.kr/?key=" + data.key + "&idx=" + data.idx + "&id=mngr");
            }
        });

        socket.on("setup", function(data) {
            if(page.log.debug) console.log("mngr socket setup", data);
            page.load();
        });

        socket.on("error", function(data) {
            if(page.log.debug) console.log("mngr socket error", data);
            doTimeout("mngr_socket_reconnect", function() {
                page.reconnect();
            }, 1000);
        });

        socket.on("close", function(data) {
            if(page.log.debug) console.log("mngr socket close", data);
            doTimeout("mngr_socket_reconnect", function() {
                page.reconnect();
            }, 3000);
        });
    },
    reconnect: function() {
        if(page.isLogin() && page.socket != null && page.socket.connected === false) {
            page.socket.connect();
            doTimeout("mngr_socket_reconnect", function() {
                page.reconnect();
            }, 3000);
        }
    },

    //불러오기
    load: function() {
        doTimeout("page_load", false);
        if(page.info.id === "" || page.info.id == "false" || page.info.id === false || page.info.bjid === "") {
            doTimeout("page_load", function() {
                page.load();
            }, 1000);
            return;
        }

        $.ajax({
            type:"POST",
            url:"https://"+serverUrl+"/mngr/save.php",
            dataType:"json",
            data:{
                type:"load",
                key:page.info.id,
                idx:page.info.bjid
            },
            success: function(data) {
                if(page.log.debug) console.log("load", page.info, data);

                if(data && data.opt !== undefined) {
                    $.each(data.opt, function(key, value) {
                        page.opt[key] = value;
                    });

                    if(page.opt.giftcontinue === true) $("#layerStarGiftNew .btn_gifts, #layerStarGiftNew .gifts_popup .gifts_panel .btn_gifts_gift").removeClass("hide");
                    else $("#layerStarGiftNew .btn_gifts, #layerStarGiftNew .gifts_popup .gifts_panel .btn_gifts_gift").addClass("hide");
                }

                if(data && data.data != undefined) {
                    var saveData = $.parseJSON(data.data);
                    page.opt.ver = !isNaN(saveData.ver) ? Number(saveData.ver) : 0;
                    if(data.prevdata != undefined && data.prevdata !== "") {
                        var prevData = $.parseJSON(data.prevdata);
                        var prevDataList = ["join", "joinfan", "joinsupport", "thank", "thankvalue", "thankstar", "thanksticker", "thankchoco", "gift", "simple", "simplesearch", "simplemanner", "simplenick", "simpledirect", "simplehome", "blindcancel", "rule", "rulechat", "alarm", "oncolor", "searchcolor", "filtercolor", "aicolor" ,"autocolor"]
                        $.each(prevDataList, function(keys, values) {
                            saveData[values] = prevData[values];
                        });

                        saveData.mouseover = prevData.over;
                        saveData.filteruse = prevData.filter;
                        saveData.filterword = prevData.filters;
                        saveData.shortuse = prevData.short;
                        saveData.dumbuse = prevData.autodumb;
                        saveData.kickuse = prevData.autokick;
                        saveData.autohiuse = prevData.greet;
                        saveData.autohitext = prevData.greetstr;
                        saveData.autoansweruse = prevData.aianswer;
                        saveData.autoanswerchat = prevData.aianswermsg;
                        saveData.autoansweruser = prevData.aianswercount;
                        saveData.autoanswerdelay = prevData.aianwertime;
                        saveData.shortlist = prevData.shortdata;
                        saveData.macrolist = prevData.macrodata;

                        $.each(prevData.answerdata, function(keys, values) {
                            saveData.autolist.push(values);
                        });
                        saveData.autoanswerregex = true;
                        saveData.dumblist = prevData.autodumbdata;
                        saveData.dumbregex = true;
                        saveData.kicklist = prevData.autokickdata;
                        saveData.kickregex = true;

                        setTimeout(function() {
                            $("#mngr_menu").append("<div class='mngr_prev_data'>이전 버전의 매니저도우미 설정을 불러왔습니다. 바뀐내용 설정을 위해 설정 버튼을 눌러서 설정 확인 후 저장해주세요.</div>");
                            var prevSavePopup = $("#mngr_menu .mngr_prev_data").on("click", function() {
                                $(this).fadeOut(200);
                                return false;
                            });
                            $("#mngr_menu .btn_addmenu_setup").on("click", function() {
                                prevSavePopup.fadeOut(200);
                            });
                        }, 1000);
                    }

                    if(saveData.id != undefined && (saveData.id == page.info.id || saveData.id == "default") && saveData.bjid != undefined && (saveData.bjid == page.info.bjid || saveData.bjid == "default")) {
                        page.data = saveData;
                        page.data.id = page.info.id;
                        page.data.bjid = page.info.bjid;
                    }

                    page.macro();

                    page.shorts();

                    page.menu();
                }
            }
        });
    },

    //매니저 메뉴
    menu: function() {
        if($("#mngr_menu").length == 0) {
            var mngrMenu = $("<div id='mngr_menu' class='mngr_toploc'><div class='check_wrap'><input type='checkbox' id='add_menu_check' checked='checked' class='check'></div></div>");
            mngrMenu.append('<div class="menu_list"><div class="menu_box"><a href="#" class="btn_addmenu_setup" onclick="alert(\'매니저도우미 서버와 연결에 실패했습니다. 웹플레이어 로그인 상태를 확인하시고 새로고침해주세요.\'); return false;" target="_blank" title="매니저 도우미 설정"><span class="new">N</span></a></div>' +
                            '<div class="menu_box mngr_btn"><a href="#" class="btn_addmenu_cmd new" title="공지, 타이머, 투표 설정"><i class="fas fa-bullhorn"></i><span class="new">N</span></a></div>' +
                            '<div class="menu_box mngr_btn"><div class="sub_menu"><a href="#" class="btn_addmenu_info" title="시청자수, 누적시청자수, 추천수 보기"></a><a href="#" class="btn_addmenu_detail" title="현재 시청자수 남녀 비율, 팬클럽 수 보기"></a></div></div>' +
                            '<div class="menu_box mngr_btn"><div class="sub_menu"><a href="#" class="btn_addmenu_kick" title="강퇴 리스트 보기"><span class="badge" style="display: none;"></span></a><a href="#" class="btn_addmenu_dumb" title="채팅금지 리스트 보기"><span class="badge" style="display: none;"></span></a></div></div>' +
                            '<div class="menu_box"><a href="#" class="btn_addmenu_direct" title="귓속말 보내기"></a></div>' +
                            '<div class="menu_box"><a href="#" title="채팅 검색" class="btn_addmenu_search"></a><a href="#" class="btn_search_del" title="검색 삭제"><img src="https://mngr.afreehp.kr/mngr/img/icon_del.png" alt=""></a></div>' +
                            '<div class="menu_box"><a href="#" class="btn_addmenu_clear" title="채팅 지우기"></a></div><div class="menu_box mngr_btn"><a href="#" id="btn_addmenu_debug" class="btn_addmenu_debug" title="테스트 모드 설정"><i class="fa fa-bug" aria-hidden="true"></i></a></div></div>');

            var mngrPanel = $("<div id='mngr_panel' class='mngr_toploc'></div>");
            mngrPanel.append("<div class='menu_panel panel_search'><a href='#' title='닫기' class='btn_panel_close'></a><div class='input_wrap'><label title='검색할 사용자의 ID또는 닉네임 입력' class='input_option search_wrap'><p class='label'>검색</p><input type='text' id='addmenu_search_input' placeholder='ID 또는 닉네임 입력' class='text'><a href='#' title='검색 삭제' class='btn_search_del'><img src='https://mngr.afreehp.kr/mngr/img/icon_del.png' alt=''></a><a href='#' title='검색' id='addmenu_search_btn'></a></div></div></div>");
            mngrPanel.append("<div class='menu_panel panel_chat'><a href='#' title='닫기' class='btn_panel_close'></a><div class='panel_wrap'><div class='chat_panel'><div class='chat_box'></div></div><div class='chat_input'><input type='text' title='귓속말 보낼 사용자 ID 입력' placeholder='ID 입력' id='addmenu_chat_id' class='text'><input type='text' placeholder='귓속말 입력' id='addmenu_chat_msg' class='text'><a href='#' title='귓속말 보내기' id='addmenu_chat_send'>보내기</a></div></div></div>");
            $("#chatting_area #chatbox").append(mngrMenu);
            $("#chatting_area #chatbox").append(mngrPanel);

            //테스트 모드 켜고 끄기
            $("#btn_addmenu_debug").on("click", function() {
                if(page.debug === false) {
                    $(this).addClass("active");
                    page.debug = true;
                    alert("테스트 모드 켜짐\r\n테스트를 위한 모드로 매크로, 자동답변, 채금, 강퇴등의 내용이 실행되지 않고, 채팅입력박스에만 표시됩니다.");
                }
                else {
                    $(this).removeClass("active");
                    page.debug = false;
                    alert("테스트 모드 꺼짐\r\n실제 사용을 위한 모드로 매크로, 자동답변, 채금, 강퇴등의 내용이 정상적으로 실행됩니다.");
                }
                return false;
            });
            if(page.debug === true) {
                $("#btn_addmenu_debug").addClass("active");
            }

            //체크박스
            $("#chatting_area .check:not(.on)").each(function() {
                $(this).addClass("on").wrap('<div class="toggle_box"></div>');
                $(this).attr("tabindex",-1).parent().append('<span class="ico"><span class="off">OFF</span><span class="on">ON</span>');
                page.style.toggle(true,this);
            });

            //메뉴 이벤트
            $("#add_menu_check").on("change", function() {
                page.style.toggle(true,this);
                if(this.checked) {
                    $("#chatting_area").removeClass("mngr_hide");
                }
                else {
                    $("#chatting_area").addClass("mngr_hide");
                }

                page.info.use = page.isUse();
            }).trigger("change");

            //설정 링크
            if(page.info.key !== "" && page.info.idx !== "") {
                $("#mngr_menu .btn_addmenu_setup").removeAttr("onclick").attr("href", "https://mngr.afreehp.kr/?key=" + page.info.key + "&idx=" + page.info.idx + "&id=mngr");
            }

            //패널
            $("#mngr_panel .btn_panel_close").on("click", function() {
                $("#mngr_panel .menu_panel.active").removeClass("active").stop(true,true).fadeOut(200);
                return false;
            });

            //검색
            page.search.init();

            //귓속말
            page.direct.init();

            //오버 간단 메뉴
            $("#chatting_area").append($("<div id='simple_menu' class='simple_menu'><a href='#' title='강퇴' class='btn_simple_kick'></a><a href='#' title='채팅금지' class='btn_simple_dumb'></a><a href='#' title='강퇴 취소' class='btn_simple_kickcancel'></a><a href='#' title='검색' class='btn_simple_search'></a><a href='#' title='귓속말' class='btn_simple_direct'></a><a href='#' title='비매너경고' class='btn_simple_manner'></a><a href='#' title='닉네임경고' class='btn_simple_nick'></a><a href='#' title='방송국' target='_blank' class='btn_simple_home'></a><a href='#' title='채팅번역' class='btn_simple_translate'></a><a href='#' title='채팅고정' class='btn_simple_chatfix'></a><a href='#' title='채팅음성고정' class='btn_simple_chatfixsound'></a><a href='#' title='채팅고정삭제' class='btn_simple_chatfixdelete'></a></div>"));
            $("#simple_menu").on("click", "a", function() {
                var getType = $(this).attr("class").replace("btn_simple_","");
                if(getType != "home") {
                    var getTarget = $(this).closest("dl");
                    if(getTarget.length === 0) {
                        getTarget = $(this).closest("#simple_menu");
                    }
                    if(getTarget.length > 0) {
                        page.simplemenu(getType, getTarget);
                    }
                    return false;
                }
            });

            //마우스 오버
            var getSimpleMenu = $("#simple_menu");
            var getScrollBottom = $(".chat_scroll_down");
            var getChatArea = $("#chat_area");
            getScrollBottom.find("button")
            function mouseLeave(target) {
                if(page.isUse()) {
                    getSimpleMenu.removeClass("simple_manager").hide();
                    $(target).removeClass("chat_on");
                }
            }

            $("#chatting_area").on("mouseenter", ".chat_area dl dt a[user_id], .chat_area .notice a[user_id]", function() {
                if(page.isUse()) {
                    getSimpleMenu.hide().removeClass("isme isadmin simple_manager");

                    var getIdMenu = $(this);
                    var getUid = getIdMenu.attr("user_id");
                    var getUname = getIdMenu.attr("user_nick");
                    var getFlag = getIdMenu.attr("userflag");
                    var getGrade = page.grade("grade", getFlag != undefined && getFlag !== "" ? getFlag : 0);

                    if(page.isMe(getUid) && page.debug === false) getSimpleMenu.addClass("isme");
                    if(page.isAdmin(getGrade)) getSimpleMenu.addClass("isadmin");

                    doTimeout("simple_hover", function() {
                        if(page.data.mouseover === true) {
                            liveView.ChatInfo.aEnv.scrollLock = true;
                            getScrollBottom.addClass("on");
                        }

                        if(page.data.simple === true) {
                            if(getUname.indexOf("<em>") > -1) {
                                getUname = getUname.split("<em>")[0];
                            }
                            if(getUid !== undefined && getUid !== null && getUid !== "") {
                                getIdMenu.append(getSimpleMenu);
                                if(page.isUse() && page.isManager() && page.data.simplekick === true) {
                                    getSimpleMenu.addClass("simple_manager");
                                }
                                getSimpleMenu.show().attr({ "data-id":getUid, "data-name":getUname }).find(".btn_simple_home").attr("href","https://bj.afreecatv.com/" + page.getid(getUid));
                            }
                        }
                    }, 100);

                    $(this).parent().addClass("chat_on");
                }
            }).on("mouseleave", ".chat_area dl dt a[user_id], .chat_area .notice a[user_id]", function() {
                if(page.isUse()) {
                    doTimeout("simple_hover", function() {
                        if(page.data.mouseover === true) {
                            getScrollBottom.find("button").trigger("click");
                            liveView.ChatInfo.aEnv.scrollLock = false;
                            getScrollBottom.removeClass("on");
                        }
                        getSimpleMenu.removeClass("simple_manager").hide();
                    }, 1000);
                    $(this).parent().addClass("chat_on");
                }
            }).on("click",".chat_area dl dd",function() {
                var getTalk = $(this).text();
                if(getTalk.indexOf("http://") > -1 || getTalk.indexOf("https://") > -1 || getTalk.indexOf("www") > -1 || getTalk.indexOf(".com") > -1 || getTalk.indexOf(".co.kr") || getTalk.indexOf(".net") > -1) {
                    var regexToken = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
                    var getLink = regexToken.exec(getTalk);
                    if(getLink != null && getLink[0] != undefined && getLink[0] != "") {
                        var getUrl = getLink[0];
                        if(getUrl.indexOf("http") === -1) getUrl = "//" + getUrl;
                        window.open(getUrl,"_blank");
                    }
                }
            });

            //히스토리 보기
            $("#mngr_menu .btn_addmenu_kick").on("click", function() {
                page.history.view("kick", "");
                return false;
            });
            $("#mngr_menu .btn_addmenu_dumb").on("click", function() {
                page.history.view("dumb", "");
                return false;
            });
            page.history.save("load");

            //메뉴 명령
            $("#mngr_menu .btn_addmenu_info").on("click",function() {
                page.infoView();
                return false;
            });
            $("#mngr_menu .btn_addmenu_detail").on("click",function() {
                page.detailView();
                return false;
            });
            $("#mngr_menu .btn_addmenu_clear").on("click",function() {
                liveView.Chat.clearChat();
                if($("#layer_mchat").is(":visible")) $("#setbox_mchat a").removeClass("off").addClass("on");
                return false;
            });

            //cmd 명령
            $("#mngr_menu .btn_addmenu_cmd").on("click", function() {
                $("#mngr_cmd_popup").stop(true,true).fadeIn(200);
                return false;
            });

            //저화질 팝업
            var getQualityCookie = page.getCookie("info_normal_quality");
            if(getQualityCookie === "agree") {
                var qualityInterval = setInterval(function() {
                    if($("#layer_high_quality").is(":visible")) {
                        $("#layer_high_quality .info_normal_quality a span").trigger("click");
                        clearInterval(qualityInterval);
                    }
                }, 100);
            }
            $("body").on("click", "#layer_high_quality .info_normal_quality a", function() {
                page.setCookie("info_normal_quality","agree","",365);
            });

            //새로운 기능 공지 알림
            var getNewNotice = page.getCookie("new_notice");
            if(getNewNotice === "new_notice_20210105") {
            }
            else {
                $("#mngr_menu .menu_list .btn_addmenu_setup").addClass("new");
            }
            $("#mngr_menu .menu_list .btn_addmenu_setup").on("click", function() {
                page.setCookie("new_notice","new_notice_20210105","",365);
                $("#mngr_menu .menu_list .btn_addmenu_setup").removeClass("new");
            });
        }

        //공지
        page.noticeClose();

        var simpleMenu = $("#simple_menu");
        simpleMenu.find(".btn_simple_kick").css("display",page.data.simplekick ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_dumb").css("display",page.data.simplekick ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_kickcancel").css("display",page.data.simplekick ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_search").css("display",page.data.simplesearch ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_direct").css("display",page.data.simpledirect ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_manner").css("display",page.data.simplemanner ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_nick").css("display",page.data.simplenick ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_home").css("display",page.data.simplehome ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_chatfix").css("display",page.data.simplechatfix ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_chatfixsound").css("display",page.data.simplechatfix ? "inline-block" : "none");
        simpleMenu.find(".btn_simple_chatfixdelete").css("display",page.data.simplechatfix ? "inline-block" : "none");

        //폰트
        $("head .mngr_font").remove();
        if(page.data.fontselect === true && page.data.font !== "") {
            if(page.data.font != "inputfont") {
                $("head").append("<style class='mngr_font'>#chat_area * { font-family:'" + page.data.font + "','돋움',dotum,AppleGothic,tahoma!important }</style>");
            }
            else {
                if(page.data.addfontname !== "" && page.data.addfonturl !== "") {
                    $("head").append("<style class='mngr_font'>#chat_area * { font-family:'" + page.data.addfontname + "'; src:" + page.data.addfonturl + " }</style>");
                }
            }
        }

        //배경색
        $("head .mngr_color").remove();
        var colorStyle = '#chat_area dl.chat_search{background:' + page.data.searchcolor + ' url("https://mngr.afreehp.kr/mngr/img/filter/icon_search.png") no-repeat right top}' +
            '#chat_area dl.chat_filter{background:' + page.data.filtercolor + ' url("https://mngr.afreehp.kr/mngr/img/filter/icon_filter.png") no-repeat right top}' +
            '#chat_area dl.chat_filternick dt{background-color:' + page.data.filtercolor + '}' +
            '#chat_area dl.chat_autokick{background:' + page.data.autocolor + ' url("https://mngr.afreehp.kr/mngr/img/filter/icon_out.png") no-repeat right top}' +
            '#chat_area dl.chat_autodumb{background:' + page.data.autocolor + ' url("https://mngr.afreehp.kr/mngr/img/filter/icon_dumb.png") no-repeat right top}' +
            '#chat_area dl.chat_ai{background:' + page.data.aicolor + ' url("https://mngr.afreehp.kr/mngr/img/filter/icon_chat.png") no-repeat right top}' +
            '#chat_area dl.chat_gift{background:' + page.data.giftcolor + ' url("https://mngr.afreehp.kr/mngr/img/filter/icon_stars.png") no-repeat right top}' +
            '#chat_area dl.chat_on{background-color:' + page.data.oncolor + '}';
        $("head").append('<style class="mngr_font">'+ colorStyle +'</style>');

        //필터링
        page.filter = {
            word:"",
            answer:[],
            dumb:[],
            kick:[]
        }
        if(page.data.filteruse === true && page.data.filterword !== "") {
            var getFilterMsg = page.data.filterword;
            var getLastWord = getFilterMsg.slice(-1);
            if(getLastWord == ",") getFilterMsg = getFilterMsg.slice(0, -1);

            if(getFilterMsg.indexOf(",") > -1) var getFilter = getFilterMsg.split(",");
            else if(getFilterMsg.indexOf("\n") > -1) var getFilter = getFilterMsg.split("\n");
            else var getFilter = getFilterMsg.split("\n");
            var getFilterArray = [];
            $.each(getFilter, function(keys, values) {
                var getText = $.trim(values);
                if(getText !== "") {
                    if(page.data.filterspecial === true) {
                        var getAddFilter = "";
                        if(getText.indexOf("!") === 0) getAddFilter = "!";
                        getText = getAddFilter + getText.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,"");
                    }
                    if(page.data.filterspace === true) {
                        getText = getText.replace(/\s*/gi,"");
                    }
                    getFilterArray.push(getText);
                }
            });
            if(getFilterArray.length > 0) {
                page.filter.word = eval("/" + getFilterArray.join("|") + "/gi");
            }
        }

        //자동답변
        if(page.data.autoansweruse === true && page.data.autolist.length > 0) {
            $.each(page.data.autolist, function(keys, values) {
                if(values[0] === true && values[1] !== "" && values[2] !== "") {
                    var getText = values[1];
                    var getLastWord = getText.slice(-1);
                    if(getLastWord == "|" || getLastWord == "&") getText = getText.slice(0, -1);
                    if(page.data.autoanswerregex !== true && getText.indexOf("&") > -1) {
                        var getAndWord = getText.split("&");
                        page.filter.answer.push([eval("/" + getAndWord.join("|") + "/gi"), values[2], getAndWord.length]);
                    }
                    else page.filter.answer.push([eval("/" + getText + "/gi"), values[2], 0]);
                }
            });
        }

        //자동채금
        if(page.data.dumbuse === true && page.data.dumblist.length > 0) {
            $.each(page.data.dumblist, function(keys, values) {
                if(values[0] === true && values[1] !== "") {
                    var getText = values[1];
                    var getLastWord = getText.slice(-1);
                    if(getLastWord == "|" || getLastWord == "&") getText = getText.slice(0, -1);
                    if(page.data.dumbregex !== true && getText.indexOf("&") > -1) {
                        var getAndWord = getText.split("&");
                        page.filter.dumb.push([eval("/" + getAndWord.join("|") + "/gi"), "", getAndWord.length]);
                    }
                    else page.filter.dumb.push([eval("/" + getText + "/gi"), "", 0]);
                }
            });
        }

        //자동강퇴
        if(page.data.kickuse === true && page.data.kicklist.length > 0) {
            $.each(page.data.kicklist, function(keys, values) {
                if(values[0] === true && values[1] !== "") {
                    var getText = values[1];
                    var getLastWord = getText.slice(-1);
                    if(getLastWord == "|" || getLastWord == "&") getText = getText.slice(0, -1);
                    if(page.data.kickregex !== true && getText.indexOf("&") > -1) {
                        var getAndWord = getText.split("&");
                        page.filter.kick.push([eval("/" + getAndWord.join("|") + "/gi"), "", getAndWord.length]);
                    }
                    else page.filter.kick.push([eval("/" + getText + "/gi"), "", 0]);
                }
            });
        }
    },

    //공지 닫기
    noticeClose: function() {
        $(".chat_notice").removeClass("open");
        doTimeout("mngr_notice", function() {
            $(".chat_notice").removeClass("open");
        }, 1000);
    },

    //메뉴 명령
    infoView: function() {
        if(page.isManager()) {
            page.statsdetail("info", function() {
                var getTotal = "";
                if($("#nTotalViewer").length > 0) {
                    getTotal = " (누적 : " + page.numberComma(page.info.detail.total) + "명)";
                }
                var getInfo = "▶ 시청자수 : " + page.numberComma(page.info.detail.view) + "명" + getTotal + " \r\n▶ 즐겨찾기 : " + page.numberComma(page.info.detail.fav) + "명\r\n▶ 팬클럽수 : " + page.numberComma(page.info.detail.fan) + "명\r\n▶ 오늘 /추천/ : " + page.numberComma(page.info.detail.up) + "개";
                if(page.info.up.today > 0 && page.info.up.recent.length > 0) {
                    getInfo += "\r\n▶ 최근 /추천/ : " + page.info.up.recent.slice(0,3).join(", ");
                }
                page.chat.check("info", getInfo);
            });
        }
    },
    detailView: function() {
        if(page.isManager()) {
            if(liveView.ChatInfo.aChatUserInfo == undefined) return;
            var getTotalLen = Object.keys(liveView.ChatInfo.aChatUserInfo).length;
            if(getTotalLen == 0) return;

            var manLen = 0;
            var womanLen = 0;
            var fanLen = 0;
            var mobileLen = 0;
            var pcLen = 0;
            $.each(liveView.ChatInfo.aChatUserInfo, function(key, value) {
                if(value.female !== undefined) {
                    var getWoman = value.female;
                    if(getWoman) womanLen += 1;
                    else manLen += 1;
                    if(liveView.ChatInfo.isFan(value.flag1)) fanLen += 1;
                    if(liveView.ChatInfo.isMobile(value.flag1)) mobileLen += 1;
                    else pcLen += 1;
                }
            });
            var getMenPercent = (manLen * 100 / getTotalLen).toFixed(1);
            var getWomanPercent = (womanLen * 100 / getTotalLen).toFixed(1);
            var getFanPercent = (fanLen * 100 / getTotalLen).toFixed(1);
            var getPcPercent = (pcLen * 100 / getTotalLen).toFixed(1);
            var getMobilePercent = (mobileLen * 100 / getTotalLen).toFixed(1);
            var getInfo = "▶ 시청자수 : " + getTotalLen + "명 (본방,로그인)\r\n ▶ 팬클럽수 : " + fanLen + "명 (" + getFanPercent + "%)\r\n▶ 남성 : " + manLen + "명 (" + getMenPercent + "%) / 여성 : " + womanLen + "명 (" + getWomanPercent + "%)\r\n▶ PC : " + pcLen + "명 (" + getPcPercent + "%) / 모바일 : " + mobileLen + "명 (" + getMobilePercent + "%)";
            page.chat.check("info", getInfo);
        }
    },

    //채팅
    chatlist:[],
    chatidx:0,
    chatprev:0,
    starlist:{},
    chat: {
        check: function(type, data) {
            if(page.log.debug) console.log("chat check", type, data);
            if(page.info.use) {
                if(page.isManager()) {
                    if(page.debug === false) {
                        if($.inArray(type, page.opt.mainlist) > -1) {
                            if(page.isSocket()) {
                                var checkData = { cmd:"check", type:type, id:page.info.id, bjid:page.info.bjid, uid:data.id };
                                if(type == "answer") {
                                    checkData.answerdelay = !isNaN(page.data.autoanswerdelay) && Number(page.data.autoanswerdelay) > 0 ? Number(page.data.autoanswerdelay) : 0;
                                    checkData.answerchat = page.data.autoanswerchat;
                                    checkData.answerchattime = !isNaN(page.data.autoanswerchattime) && Number(page.data.autoanswerchattime) > 0 ? Number(page.data.autoanswerchattime) : 0;
                                    checkData.answerchatidx = data.idx;
                                    checkData.answeruser = page.data.autoansweruser;
                                    checkData.answerusertime = !isNaN(page.data.autoanswerusertime) && Number(page.data.autoanswerusertime) > 0 ? Number(page.data.autoanswerusertime) : 0;
                                    checkData.answeruserid = data.id;
                                }
                                page.socket.emit("cmd", checkData, function(result) {
                                    if(page.log.debug) console.log("socket", result);
                                    if(result.result != undefined && result.result === true) {
                                        page.chat.msg(type, data, result.data);
                                    }
                                    if(result.cmd != undefined & result.cmd !== "") {
                                        window[result.cmd] = false;
                                    }
                                });
                            }
                        }
                        else if($.inArray(type, page.opt.sublist) > -1 && page.opt.maincheck === true) {
                            page.chat.msg(type, data);

                            page.opt.maincheck = false;
                            doTimeout("mngr_sublist", function() {
                                page.opt.maincheck = true;
                            }, 1000);
                        }
                        else {
                            page.chat.msg(type, data);
                        }
                    }
                    else {
                        page.chat.msg(type, data);
                    }
                }
                else {
                    if($.inArray(type, page.opt.sublist) > -1 && page.opt.subcheck === true) {
                        page.chat.msg(type, data);

                        page.opt.subcheck = false;
                        doTimeout("mngr_sublist", function() {
                            page.opt.subcheck = true;
                        }, 3000);
                    }
                }
            }
        },
        msg: function(type, data, result) {
            var getMsg = "";
            if(type == "short" || type == "info" || type == "macro" || type == "join" || type == "gift" || type == "direct" || type == "cmd") {
                getMsg = data;

                if(type === "cmd") {
                    log("cmd",{ type:"cmd", bjid:page.info.bjid, id:page.info.id, msg:getMsg });
                }
            }
            else if(type == "kick" || type == "dumb") {
                var getKickData = { id:data.id, name:data.name, type:"", msg:"" };
                if(type == "kick") getKickData.type = 0;
                page.chat.kick(type, getKickData);
            }
            else if(type == "manner" || type == "nick") {
                getMsg = (type == "manner" ? "[" + (data.name == "" ? data.id : data.name)  + "]님 매너채팅 부탁드립니다!" : "[" + data.id + "]님 닉 변경부탁드립니다.\r\n계속사용하실 경우 강퇴 될 수 있습니다!");
            }
            else if(type == "chatfix" || type == "chatfixsound") {
                getMsg = "!" + (type == "chatfix" ? "고정" : "음성고정") + "/" + data.id;
            }
            else if(type == "chatfixdelete") {
                getMsg = "!고정삭제";
            }
            else if(type == "answer") {
                getMsg = page.replacedetail({ id:data.id, name:data.name }, data.msg);
            }
            else if(type == "greet") {
                //자동인사
                getMsg = page.replacedetail({ id:data.id, name:data.nickname }, page.data.autohitext);
            }
            else if(type == "up") {
                //추천인사
                getMsg = page.replacedetail({ uplist:data.uplist, up:data.up }, page.data.autouptext);
            }
            else if(type == "rule") {
                //매너
                getMsg = page.replacedetail({ id:data.id, name:data.name }, page.data.rulechat);
            }

            if(getMsg !== "") {
                getMsg = page.replaceword(type, getMsg);

                if(page.debug === false) {
                    getMsg = page.brtext(false, getMsg);
                    if(getMsg.indexOf("/to") === 0) {
                        if(page.grade("mobile",data.flag1) === false) {
                            $("#write_area").html(getMsg);
                            $("#btn_send").trigger("click");
                        }
                    }
                    else {
                        if(liveView._playerController.sendChat) liveView._playerController.sendChat({ szMessage : getMsg, nType : 0 });
                    }
                }
                else {
                    $("#write_area").html(getMsg);
                }
            }
            if(page.log.debug || page.debug === true) console.log("msg run", type, data, getMsg);
        },
        gift: function(type, data) {
            var getMsg = "";
            if(page.log.debug) console.log("gift", type, data);
            if(type == "join" || type == "gift") {
                getMsg = page.replacedetail(data, page.data[data.type]);

                if(page.starlist[data.id] != undefined && page.starlist[data.id] != null) {
                    clearTimeout(page.starlist[data.id]);
                    page.starlist[data.id] = null;
                    delete page.starlist[data.id];
                }
                page.starlist[data.id] = setTimeout(function() {
                    page.starlist[data.id] = null;
                    delete page.starlist[data.id];
                }, 30000);

                if(getMsg !== "") {
                    if(page.data.gift === true && (data.type == "thankfollow" || data.type == "thankadcon" || (!isNaN(page.data.giftcount) && data.val >= Number(page.data.giftcount)))) {
                        page.shortgift({ msg:getMsg, type:data.type, val:data.type == "thankfollow" ? data.follow : data.val });
                    }

                    var getCheck = false;
                    if(type == "join" && page.data.join === true) {
                        getCheck = true;
                    }
                    else if(type == "gift" && page.data.thank === true && (data.thankfollow === "thankfollow" || data.thankfollow === "thankadcon" || (!isNaN(page.data.thankvalue) && data.val >= Number(page.data.thankvalue)))) {
                        getCheck = true;
                    }
                    if(getCheck === true) {
                        if(!page.isMe(data.id) || page.debug === true) {
                            page.chat.check(type, getMsg);
                        }
                    }
                }
            }
        },
        kick: function(type, data) {
            if(page.isManager()) {
                if(page.log.debug) console.log(type, data);
                if(page.debug === false) {
                    if(type == "kick" || type == "kickcancel") {
                        if(liveView._playerController.sendKickAndCancel) liveView._playerController.sendKickAndCancel({
                            szUserId: data.id,
                            szUserNick: data.name,
                            szBjId: page.info.bjid,
                            nBroadNo: page.info.nid,
                            nType: data.type,
                            szMessage: data.msg
                        });
                    }
                    else {
                        if(liveView._playerController.sendDumb) liveView._playerController.sendDumb({
                            szUserId: data.id,
                            szMessage: data.msg
                        });
                    }
                }
                else {
                    $("#write_area").html(type + " / " + data.name + "(" + data.id + ")");
                }

                if((type == "kick" || type == "dumb") && page.data.rule === true && page.data.rulechat !== "") {
                    page.chat.msg("rule", { id:data.id, name:data.name });
                }
            }
        }
    },

    //매니저
    cmdtest: function(data) {
        var getCmd = data.cmd;
        var getData = data.data;
        var getChat = data.chat;

        if(page.mngr[getCmd] != undefined) {
            var getResult = page.mngr[getCmd](getData, getChat);
            if(page.log.debug) console.log(getResult);
        }
    },
    mngr: {
        msg: function(data) { //메시지
            var getResultMsg = "";
            var getGrade = page.grade("grade", data.flag);
            var getFollow = page.grade("follow", data.flag);
            var getSupport = page.grade("support", data.flag);

            var getId = page.getid(data.senderID);
            var getName = data.nickname;
            var getMsg = data.message;

            if(page.log.debug) console.log("msg", data, getGrade, getFollow, getSupport);

            page.opt.idx += 1;

            //선물후 채팅 체크
            var checkFilterClass = [];

            //TODO 자기 채팅 체크제외
            if(!page.isMe(getId) || page.debug === true) {
                if(page.starlist[getId] != undefined && page.starlist[getId] != null) {
                    page.starlist[getId] = null;
                    delete page.starlist[getId];
                    checkFilterClass.push("chat_gift");
                }

                //필터링
                if(page.data.filteruse === true && page.filter.word !== "") {
                    var checkFilterWord = false;
                    if(page.filter.word.test(getMsg)) {
                        checkFilterClass.push("chat_filter");
                        checkFilterWord = true;
                    }
                    else if(page.filter.word.test(getName)) {
                        checkFilterClass.push("chat_filternick");
                        checkFilterWord = true;
                    }
                    page.filter.word.lastIndex = 0;
                    if(checkFilterWord === true && page.data.alarm === true) {
                        page.alarm();
                    }
                }

                //검색
                if(page.info.search === true && page.info.searchid !== "") {
                    if(page.info.searchid.test(getId) || page.info.searchnick.test(getName)) {
                        checkFilterClass.push("chat_search");
                    }
                    page.info.searchid.lastIndex = 0;
                    page.info.searchnick.lastIndex = 0;
                }

                if(page.isManager()) {
                    //자동 답변
                    var getFilterCheck = false;
                    if(page.data.autoansweruse === true && page.filter.answer.length > 0) {
                        var getCheck = false;
                        if(page.data.autograde !== "all") {
                            getCheck = page.isGrade(page.data.autograde, data.flag);
                        }
                        else {
                            getCheck = true;
                        }

                        if(page.data.autoanswermngr != undefined && page.data.autoanswermngr === true && page.isAdmin(getGrade)) {
                            getCheck = false;
                        }

                        if(getCheck === true) {
                            var getFilterMsg = getMsg;
                            if(page.data.autoanswerspecial === true) {
                                var getAddFilter = "";
                                if(getFilterMsg.indexOf("!") === 0) getAddFilter = "!";
                                getFilterMsg = getAddFilter + getFilterMsg.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,"");
                            }
                            if(page.data.autoanswerspace === true) {
                                getFilterMsg = getFilterMsg.replace(/\s*/gi,"");
                            }
                            var getResult = page.filtercheck("answer", getFilterMsg);
                            getFilterCheck = getResult[0];
                            if(getResult[0] === true && getResult[1] !== "") {
                                page.chat.check("answer", { id:getId, name:getName, msg:getResult[1], idx:getResult[2] });
                                checkFilterClass.push("chat_ai");
                            }
                        }
                    }

                    if(!page.isAdmin(getGrade) || page.debug === true) {
                        //자동 채금
                        var checkDumb = "";
                        if(getFilterCheck === false && page.data.dumbuse === true && page.filter.dumb.length > 0) {
                            var getCheck = false;
                            if(page.data.dumbgrade !== "all") {
                                if(page.opt.ver === undefined || page.opt.ver < 20190101) {
                                    getCheck = page.isGrade(page.data.dumbgrade, data.flag);
                                }
                                else {
                                    getCheck = page.isBelow(page.data.dumbgrade, data.flag);
                                }
                            }
                            else {
                                getCheck = true;
                            }

                            if(getCheck === true) {
                                var getFilterMsg = getMsg;
                                if(page.data.dumbspecial === true) {
                                    var getAddFilter = "";
                                    if(getFilterMsg.indexOf("!") === 0) getAddFilter = "!";
                                    getFilterMsg = getAddFilter + getFilterMsg.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,"");
                                }
                                if(page.data.dumbspace === true) {
                                    getFilterMsg = getFilterMsg.replace(/\s*/gi,"");
                                }
                                var getResult = page.filtercheck("dumb", getFilterMsg);
                                getFilterCheck = getResult[0];
                                if(getResult[0] === true) {
                                    page.chat.check("dumb", { id:getId, name:getName });
                                    checkFilterClass.push("chat_autodumb");
                                }
                            }
                        }

                        //자동 강퇴
                        var checkKick = "";
                        if(getFilterCheck === false && page.data.kickuse === true && page.filter.kick.length > 0) {
                            var getCheck = false;
                            if(page.data.kickgrade !== "all") {
                                if(page.opt.ver === undefined || page.opt.ver < 20190101) {
                                    getCheck = page.isGrade(page.data.kickgrade, data.flag);
                                }
                                else {
                                    getCheck = page.isBelow(page.data.kickgrade, data.flag);
                                }
                            }
                            else {
                                getCheck = true;
                            }

                            if(getCheck === true) {
                                var getFilterMsg = getMsg;
                                if(page.data.kickspecial === true) {
                                    var getAddFilter = "";
                                    if(getFilterMsg.indexOf("!") === 0) getAddFilter = "!";
                                    getFilterMsg = getAddFilter + getFilterMsg.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,"");
                                }
                                if(page.data.kickspace === true) {
                                    getFilterMsg = getFilterMsg.replace(/\s*/gi,"");
                                }
                                var getResult = page.filtercheck("kick", getFilterMsg);
                                getFilterCheck = getResult[0];
                                if(getResult[0] === true) {
                                    page.chat.check("kick", { id:getId, name:getName });
                                    checkFilterClass.push("chat_autokick");

                                    //log("kick",{ type:"autokick", bjid:page.info.bjid, id:page.info.id, uid:getId, uname:getName, msg:getFilterMsg });
                                }
                            }
                        }
                    }
                }
            }

            //신고
            if(page.isManager() && data.message.indexOf("!신고") === 0) {
                page.report.run({id:getId, name:getName, msg:data.message});
            }

            //getResultMsg = $(chat).addClass("mngr_chat " + checkFilterClass.join(" ")).attr({ "data-mngrid": page.opt.idx, "data-chatid":getId, "data-chatname":getName }).get(0).outerHTML;

            if(page.isManager() && page.isMe(getId)) {
                if(data.message.indexOf("!수정") === 0 || data.message.indexOf("!추가") === 0 || data.message.indexOf("!삭제") === 0) {
                    page.edit.answer(data.message);
                }
            }
        },
        join: function(data) {  //입장
            var getCheck = false;
            if(page.data.autohiuse === true && !page.isMe(data.id)) {
                if(page.data.autohigrade != "all") {
                    getCheck = page.isGrade(page.data.autohigrade, data.flag1);
                }
                else {
                    getCheck = true;
                }
            }

            // if(page.log.debug) console.log("join", data, getCheck);
            if(getCheck === true) {
                if(page.opt.joinlist[data.id] == undefined) {
                    page.opt.joinlist[data.id] = setTimeout(function() {
                        page.opt.joinlist[data.id] = undefined;
                        delete page.opt.joinlist[data.id];
                    }, 1000 * 30);
                    page.chat.check("greet" ,data);
                }
            }
        },
        balloon: function(data) {
            if(page.log.debug) console.log("balloon", data);
            var getId = page.getid(data.sender_id);
            var getName = data.sender_nickname;
            var getVal = Number(data.cnt);
            var getJoin = Number(data.fan_order);

            if(!isNaN(getVal)) {
                if(getJoin > 0) page.chat.gift("join", { type:"joinfan", id:getId, name:getName, val:getVal, join:getJoin });
                else page.chat.gift("gift", { type:"thankstar", id:getId, name:getName, val:getVal });
            }
        },
        sticker: function(data) {
            if(page.log.debug) console.log("sticker", data);
            var getId = page.getid(data.sender_id);
            var getName = data.sender_nickname;
            var getVal = Number(data.cnt);
            var getJoin = Number(data.supporter_order);

            if(!isNaN(getVal)) {
                if(getJoin > 0) page.chat.gift("join", { type:"joinsupport", id:getId, name:getName, val:getVal, join:getJoin });
                else page.chat.gift("gift", { type:"thanksticker", id:getId, name:getName, val:getVal });
            }
        },
        chocolate: function(data) {
            if(page.log.debug) console.log("chocolate", data);
            var getId = page.getid(data.sender_id);
            var getName = data.sender_nickname;
            var getVal = Number(data.cnt);

            if(!isNaN(getVal)) {
                page.chat.gift("gift", { type:"thankchoco", id:getId, name:getName, val:getVal });
            }
        },
        subscription_item_effect: function(data) {
            if(page.log.debug) console.log("subscription_item_effect", data);
            var getId = page.getid(data.sendId);
            var getName = data.sendNick;
            var getVal = Number(data.month);

            if(!isNaN(getVal)) {
                page.chat.gift("gift", { type:"thankfollow", id:getId, name:getName, follow:getVal });
            }
        },
        adcon_effect: function(data) {
            if(page.log.debug) console.log("adcon_effect", data);
            var getId = page.getid(data.userID);
            var getName = data.userNickname;
            var getVal = Number(data.adcon_cnt);
            var getTitle = data.title;

            if(!isNaN(getVal)) {
                page.chat.gift("gift", { type:"thankadcon", id:getId, name:getName, val:getVal, title:getTitle });
            }
        },
        direct_receive: function(data) {
            page.direct.chat("receive", data);
        },
        direct_send: function(data) {
            page.direct.chat("send", data);
        }
    },

    //간단 메뉴
    simplemenu: function(type, target) {
        var getId = $(target).find("a[user_id]").attr("user_id");
        var getName = $(target).find("a[user_nick]").attr("user_nick");

        if(getId === undefined || getId === null || getId === "") {
            getId = $(target).data("id");
            getName = $(target).data("name");
        }

        if(getId !== undefined && getId !== null && getId !== "") {
            if(type == "kick" || type == "dumb" || type == "kickcancel") {
                var getKickData = { id:getId, name:getName, type:"", msg:"" };
                if(type == "kick") getKickData.type = 0;
                else if(type == "kickcancel") getKickData.type = 1;
                page.chat.kick(type, getKickData);

                //log("kick",{ type:"simplekick", bjid:page.info.bjid, id:page.info.id, uid:getId, uname:getName });
            }
            else if(type == "search") {
                $("#addmenu_search_input").val(getId);
                $("#addmenu_search_btn").trigger("click");
            }
            else if(type == "direct") {
                page.direct.show(getId);
            }
            else if(type == "manner" || type == "nick" || type == "chatfix" || type == "chatfixsound" || type == "chatfixdelete") {
                if(page.isManager()) {
                    page.chat.msg(type, { id:getId, name:getName });
                }
            }
        }
    },

    //검색
    search: {
        init: function() {
            $("#mngr_menu .btn_addmenu_search").on("click", function() {
                var getPanel = $("#mngr_panel .panel_search");
                if(getPanel.hasClass("active")) {
                    getPanel.removeClass("active").stop(true,true).fadeOut(200);
                }
                else {
                    $("#mngr_panel .menu_panel.active").removeClass("active").stop(true,true).fadeOut(200);
                    getPanel.addClass("active").stop(true,true).fadeIn(200);
                    $("#addmenu_search_input").focus();
                }
                return false;
            });

            $("#addmenu_search_input").on("keyup",function(e) {
                if(e.keyCode == 13) $("#addmenu_search_btn").trigger("click");
            });
            $("#addmenu_search_btn").on("click",function() {
                var getVal = $("#addmenu_search_input").val();
                if(getVal == "") {
                    $("#mngr_menu .btn_search_del").trigger("click");
                    $("#addmenu_search_input").focus();
                }
                else {
                    page.search.run(true, getVal);
                }
                return false;
            });
            $("#mngr_panel .btn_search_del, #mngr_menu .btn_search_del").on("click", function() {
                page.search.run(false, "");
                return false;
            });
        },
        run: function(type, val) {
            page.info.search = type;
            if(type === true) {
                page.info.searchid = eval("/^" + val + "$/i");
                page.info.searchnick = eval("/" + val + "/i");
                $("#mngr_menu .btn_search_del").show();
                $("#mngr_panel .panel_search .btn_search_del").show();
                $("#chat_area dl a[user_id*='" + val + "']").closest("dt").addClass("chat_search");
                $("#chat_area dl a[user_nick*='" + val + "']").closest("dt").addClass("chat_search");
            }
            else {
                page.info.searchword = "";
                $("#addmenu_search_input").val("");
                $("#chat_area dl.chat_search").removeClass("chat_search");
                $("#mngr_panel .btn_search_del, #mngr_menu .btn_search_del").hide();
            }
        }
    },

    //귓속말
    direct: {
        init: function() {
            $("#mngr_menu .btn_addmenu_direct").on("click",function() {
                var getPanel = $("#mngr_panel .panel_chat");
                if(getPanel.hasClass("active")) {
                    getPanel.removeClass("active").stop(true,true).fadeOut(200);
                }
                else {
                    page.direct.show("");
                }
                return false;
            });
            $("#addmenu_chat_msg").on("keyup",function(e) {
                if(e.keyCode == 13) $("#addmenu_chat_send").trigger("click");
            });
            $("#addmenu_chat_send").on("click",function() {
                var getChatId = $("#addmenu_chat_id").val();
                var getChatMsg = $("#addmenu_chat_msg").val();
                if(getChatId == "") $("#addmenu_chat_id").focus();
                else if(getChatMsg == "") $("#addmenu_chat_msg").focus();
                else {
                    page.chat.msg("direct","/to " + getChatId + " " + getChatMsg);
                    $("#addmenu_chat_msg").val("");
                }
                return false;
            });
            $("#mngr_panel .chat_panel").on("click",".chat_id, .chat_msg",function() {
                var getId = $(this).closest(".chat_content").data("uid");
                if(getId != "") {
                    $("#addmenu_chat_id").val(getId);
                    $("#addmenu_chat_msg").focus();
                }
                return false;
            });
        },
        show: function(id) {
            $("#mngr_panel .menu_panel.active").removeClass("active").stop(true,true).fadeOut(200);
            $("#mngr_panel .panel_chat").addClass("active").stop(true,true).fadeIn(200);
            $("#mngr_menu.msg").removeClass("msg");
            $("#addmenu_chat_id").focus();
            var directScroll = $("#mngr_panel .chat_panel");
            directScroll.scrollTop(directScroll.prop("scrollHeight") + 10);

            if(id !== "") {
                $("#addmenu_chat_id").val(id);
                $("#addmenu_chat_msg").val("");
                setTimeout(function() {
                    $("#addmenu_chat_msg").focus();
                }, 300);
            }
        },
        chat: function(type, data) {
            if(type == "receive") {
                if($.inArray(data.id, liveView.ChatInfo.chatIgnoreInfo[page.info.nid]) > -1) return "";
            }

            if(page.isUse()) {
                var getNow = new Date();
                var getTime = ((getNow.getHours() < 10)?"0":"") + getNow.getHours() +":"+ ((getNow.getMinutes() < 10)?"0":"") + getNow.getMinutes();
                var getId = data.id;
                var getNick = data.nickname;
                var chatDirect = $("#mngr_panel .chat_box");
                var directId = getNick + "(" + getId + ")" + (type == "send" ? " 님에게" : " 님이");
                var directMsg = $('<div data-uid="' + getId + '" class="chat_content chat_you"><div class="chat_wrap"><p class="chat_id">' + directId + '</p><div class="box_wrap"><p class="chat_msg">' + data.message +'<span class="chat_time">' + getTime + '</span></p></div></div></div>');
                if(type == "send") directMsg.addClass("chat_me");
                chatDirect.append(directMsg);
                var directScroll = $("#mngr_panel .chat_panel");
                directScroll.scrollTop(directScroll.prop("scrollHeight") + 10);

                if(type == "receive" && !$("#mngr_panel .panel_chat").is(":visible")) {
                    $("#mngr_menu").addClass("msg");
                    $("#addmenu_chat_id").val(getId);
                    $("#addmenu_chat_msg").val("");
                }

                if(type == "receive") {
                    if(page.isManager() && data.message.indexOf("!신고") === 0) {
                        page.report.run({id:getId, name:getName, msg:data.message});
                    }
                }
            }
        }
    },

    edit: {
        answer: function(msg) {
            var getTextList = msg.split(" ");
            if(page.log.debug) console.log("edit", msg, getTextList);
            if(getTextList.length > 1) {
                var getCmd = getTextList[0];
                var getQ = getTextList[1];
                var getA = getTextList.length > 2 ? getTextList.slice(2).join(" ") : "";
                if((getQ !== "" && getA !== "") || (getCmd == "!삭제" && getQ !== "")) {
                    $.ajax({
                        type:"POST",
                        url:"https://"+serverUrl+"/mngr/save.php",
                        dataType:"json",
                        data:{
                            type:"edit",
                            subtype:"answer",
                            cmd:getCmd,
                            key:page.info.id,
                            idx:page.info.bjid,
                            q:getQ,
                            a:getA
                        },
                        success: function(data) {
                            if(data && data.result != undefined && data.result == "ok") {
                                page.load();
                            }
                        }
                    });
                }
            }
        }
    },

    //매크로
    macrolist: [],
    macro: function() {
        $.each(page.macrolist, function(key, value) {
            clearInterval(value);
        });
        page.macrolist = [];

        if(page.data.macro != undefined && page.data.macro === true) {
            $.each(page.data.macrolist, function(key, value) {
                var getMacro = value;
                if(getMacro.length > 2 && getMacro[0] === true) {
                    var getTime = !isNaN(getMacro[1]) ? Number(getMacro[1]) : 600;
                    var getIdx = setInterval(function() {
                        page.chat.check("macro", getMacro[2]);
                    }, getTime * 1000);
                    page.macrolist.push(getIdx);
                }
            });
        }
    },

    //필터링
    filtercheck: function(type, msg) {
        var getResult = [false, "", 0];
        var getFilterList = page.filter[type];
        if(getFilterList.length > 0) {
            $.each(getFilterList, function(key, value) {
                if(value[0] !== "") {
                    if(value[2] === 0) {
                        if(value[0].test(msg)) {
                            getResult = [true, ""];
                            if(type == "answer") {
                                getResult[1] = value[1];
                                getResult[2] = key;
                            }
                            value[0].lastIndex = 0;
                            return false;
                        }
                    }
                    else if(value[2] > 1) {
                        var getMatch = msg.match(value[0]);
                        if(getMatch != null && value[2] === getMatch.length) {
                            getResult = [true, ""];
                            if(type == "answer") {
                                getResult[1] = value[1];
                                getResult[2] = key;
                            }
                            return false;
                        }
                    }
                }
            });
        }
        return getResult;
    },

    //단축메뉴
    shorts: function() {
        $("#short_menu").remove();
        if(page.data.shortuse === true) {
            $("#actionbox").append("<div id='short_menu'><div class='short_area'></div></div>");
            var shortMenu = $("#short_menu").show();
            shortMenu.find(".short_area").append("<div class='ballon_wrap'></div><div class='short_wrap'></div>");
            var btnShort = shortMenu.find(".short_wrap");
            $.each(page.data.shortlist,function(key, value) {
                btnShort.append("<a href='#' title='" + value[1] + "' class='short_btn'>" + value[0] + "</a>");
            });
            shortMenu.off("click",".short_btn, .gift_btn").on("click",".short_btn, .gift_btn",function() {
                page.chat.check("short", $(this).attr("title"));
                return false;
            });
        }
    },
    shortgift: function(data) {
        var shortMenu = $("#short_menu");
        var getShortBtn = $('<a href="#" title="' + data.msg + '" class="gift_btn ' + data.type + '">' + data.val + '</a>');
        var getCurrentBtn = shortMenu.find(".gift_btn");
        if(getCurrentBtn.length > 4) {
            getCurrentBtn.slice(0,getCurrentBtn.length - 4).remove();
        }
        shortMenu.find(".ballon_wrap").append(getShortBtn);
        setTimeout(function() {
            if(getShortBtn.length > 0) {
                getShortBtn.remove();
            }
        }, !isNaN(page.data.gifttime) ? (Number(page.data.gifttime) * 1000) : (1000 * 60));
    },

    //정보
    stats: function() {
        doTimeout("mngr_stats", function() {
            if(page.isLogin() && page.info.bjid !== "") {
                if(page.info.sid === "") {
                    $.ajax({
                        url:"https://st.afreecatv.com/api/get_station_status.php",
                        dataType:"json",
                        data:{
                            szBjId:page.info.bjid
                        },
                        success: function(data) {
                            if(data && data.DATA != undefined && data.DATA.user_id != undefined) {
                                page.info.sid = data.DATA.station_no;
                                page.statsdetail("stats");
                            }
                        }
                    });
                }
                else {
                    page.statsdetail("stats");
                }
            }

            page.stats();
        }, page.info.statstime);
    },
    statsdetail: function(type, fnc) {
        if(page.isLogin() && page.info.bjid !== "" && page.info.sid !== "") {
            $.ajax({
                type:"POST",
                url:"https://api.m.afreecatv.com/station/main/a/getmaindata",
                dataType:"json",
                data:{
                    bj:page.info.bjid,
                    station_no:page.info.sid
                },
                success: function(data) {
                    if(data && data.result != undefined && data.result === 1 && data.data != undefined) {
                        if(data.data.liveBroadInfo != undefined && data.data.liveBroadInfo.length > 0) {
                            page.info.detail.title = data.data.liveBroadInfo[0].broad_title;
                            page.info.detail.start = data.data.liveBroadInfo[0].broad_start;
                            page.info.detail.view = data.data.liveBroadInfo[0].view_cnt;
                            page.info.nid = data.data.liveBroadInfo[0].broad_no;
                        }
                        if(data.data.fanclubCnt != undefined) page.info.detail.fan = data.data.fanclubCnt;
                        if(data.data.supporterCnt != undefined) page.info.detail.sup = data.data.supporterCnt;
                        if(data.data.subscriptionInfo != undefined) page.info.detail.follow = data.data.subscriptionInfo.subscriptionCnt;
                        if($("#nTotalViewer").length > 0) page.info.detail.total = parseInt($("#nTotalViewer").text().replace(/,/g, ""), 10);
                        if(data.data.stationUpdInfo != undefined) {
                            page.info.detail.fav = data.data.stationUpdInfo.fan_cnt;
                            page.info.detail.up = data.data.stationUpdInfo.today_ok_cnt;
                        }
                    }

                    if(type == "info" && fnc != undefined) {
                        fnc();
                    }
                }
            });
        }
    },

    //스타일 설정
    style: {
        check: true,
        init: function() {
            if(page.style.check === false) return;
            page.style.check = false;

            //채팅
            page.style.chat();

            //매니저 채팅
            page.style.managerChat();

            //메뉴 상태
            page.style.menustats();
        },
        chat: function() {
            var contBox = $("#webplayer_contents");
            var chatLine = $("<div class='chat_line'></div>");
            var chatBox = $("#chatting_area").append(chatLine);
            var chatVideobox = $("#player_area");
            var listBox = $("#list_area");
            var favBox = $("#list_bookmark_area");
            var webplayer = $("#webplayer");
            var managerPopup = $("#layer_mchat");
            var body = $("body");

            $(".move_handle").hide();

            var lineResizeCheck = false;
            var lineLeft = 0;
            var lineMove = 0;
            var chatLeft = 0;
            var contWidth = 0;
            var listWidth = 0;
            var favWidth = 0;

            function chatMove(chatRight) {
                var videoRight = contWidth - (contWidth - (chatRight + listWidth + favWidth));
                chatVideobox.css({
                    right:videoRight > 0 ? videoRight + 4 : videoRight
                });
                chatBox.css({
                    width:chatRight
                });
            }

            var chatResizeInterval = null;
            chatLine.on("mousedown",function() {
                clearTimeout(chatResizeInterval);
                lineResizeCheck = true;
                lineLeft = chatBox.offset().left;
                contWidth = parseInt(contBox.width(), 10);
                chatWidth = webplayer.hasClass("chat_open") ? parseInt(chatBox.width(), 10) : 0;
                listWidth = !body.hasClass("smode") && listBox.is(":visible") && webplayer.hasClass("list_open") ? parseInt(listBox.width(), 10) + 20 : 0;
                favWidth = !body.hasClass("smode") && favBox.is(":visible") && webplayer.hasClass("list_bookmark_open") ? parseInt(favBox.width(), 10) + 20 : 0;

                $("body > .wrap").attr("onselectstart","return false").addClass("noselect");
                $(document).one("mouseup.lineresize",function() {
                    lineResizeCheck = false;
                    $("body > .wrap").removeAttr("onselectstart").removeClass("noselect");
                    $(document).off("mousemove.lineresize");
                    page.setCookie("mng_chat_resize",chatBox.width() - 1,"",365);

                }).on("mousemove.lineresize",function(e) {
                    clearTimeout(chatResizeInterval);
                    if(lineResizeCheck && e.pageX) {
                        var chatPos = chatBox.offset().left;
                        lineMove = lineLeft - e.pageX;
                        var chatRight = chatWidth + lineMove;
                        if(chatRight < 201) chatRight = 200;
                        chatMove(chatRight);
                    }
                    chatResizeInterval = setTimeout(function() {
                        $("body > .wrap.noselect").removeAttr("onselectstart").removeClass("noselect");
                    }, 5000);
                });
            });

            var getChatRight = page.getCookie("mng_chat_resize");
            if(getChatRight && !isNaN(getChatRight)) {
                contWidth = parseInt(contBox.width(), 10);
                chatWidth = webplayer.hasClass("chat_open") ? parseInt(chatBox.width(), 10) : 0;
                listWidth = !body.hasClass("smode") && listBox.is(":visible") && webplayer.hasClass("list_open") ? parseInt(listBox.width(), 10) + 20 : 0;
                favWidth = !body.hasClass("smode") && favBox.is(":visible") && webplayer.hasClass("list_bookmark_open") ? parseInt(favBox.width(), 10) + 20 : 0;
                chatMove(parseInt(getChatRight));
            }

            $("#topmenu_chat a, #topmenu_airlist a, #topmenu_fav a, .smode_chatbtn a, .listbox .headbtn .close a, .favbox .headbtn .close a").on("click",function() {
                page.style.managerResize();
                chatResize();

                page.setCookie("player_menu_chat",$("#topmenu_chat a").hasClass("off") ? "off" : "on","",365);
                page.setCookie("player_menu_artlist",$("#topmenu_airlist a").hasClass("off") ? "off" : "on","",365);
                page.setCookie("player_menu_fav",$("#topmenu_fav a").hasClass("off") ? "off" : "on","",365);
            });

            $("#layer_mchat .btn_close").on("click",function() {
                page.setCookie("player_menu_manager", "off", "", 365);
            });
            $("#setbox_mchat a").on("click", function() {
                setTimeout(function() {
                    page.setCookie("player_menu_manager", "on", "", 365);
                }, 100);
            });

            $(".btn_smode").on("click", function() {
                setTimeout(function() {
                    chatResize();
                }, 100);
            });

            $(".btn_extend_mode").on("click", function() {
                setTimeout(function() {
                    chatResize();
                }, 100);
            });

            var resizeInterval = null;
            chatResize = function() {
                clearTimeout(resizeInterval);
                resizeInterval = setTimeout(function() {
                    contWidth = parseInt(contBox.width(), 10);
                    chatWidth = webplayer.hasClass("chat_open") ? parseInt(chatBox.width(), 10) : 0;
                    listWidth = !body.hasClass("smode") && listBox.is(":visible") && webplayer.hasClass("list_open") ? parseInt(listBox.width(), 10) + 20 : 0;
                    favWidth = !body.hasClass("smode") && favBox.is(":visible") && webplayer.hasClass("list_bookmark_open") ? parseInt(favBox.width(), 10) + 20 : 0;
                    var videoRight = contWidth - (contWidth - (chatWidth + listWidth + favWidth));
                    chatVideobox.css({
                        right:videoRight > 0 ? videoRight + 4 : videoRight
                    });
                },100);
            }

            $(window).on("resize",function() {
                chatResize();
            });
            chatResize();

            //폰트 설정
            $("#chatting_area").append("<select title='폰트 크기 선택' id='add_chat_fontsize'><option value='10'>10px</option><option selected='selected' value='12'>12px</option><option value='14'>14px</option><option value='16'>16px</option><option value='18'>18px</option><option value='20'>20px</option><option value='24'>24px</option><option value='30'>30px</option><option value='40'>40px</option><option value='50'>50px</option><option value='60'>60px</option></select>");
            var getFontSize = $("#add_chat_fontsize").on("change",function() {
                $("#chatting_area .chat_area").removeClass("font_size10 font_size12 font_size14 font_size16 font_size18 font_size20 font_size24 font_size30 font_size40 font_size50 font_size60").addClass("font_size" + this.value);
                page.setCookie("player_menu_fontsize",this.value,"",365);
            });
            //폰트 크기
            var getMenufontsize = page.getCookie("player_menu_fontsize");
            if(getMenufontsize && getMenufontsize != "") {
                getFontSize.val(getMenufontsize).trigger("change");
            }

            //이전 채팅
            $("body").on("keyup", "#write_area", function(e) {
                if(page.data.chatprev != undefined && page.data.chatprev === true) {
                    if(e.keyCode == 38 || e.keyCode == 40) {
                        if(e.keyCode == 38) {
                            if(page.chatprev === -1) page.chatidx -= 1;
                            page.chatprev = -1;
                            if(page.chatidx < 0) {
                                page.chatidx = page.chatlist.length - 1;
                            }
                        }
                        else {
                            page.chatidx += 1;
                            if(page.chatidx > page.chatlist.length - 1) {
                                page.chatidx = 0;
                            }
                        }
                        var getPrevChat = page.chatlist[page.chatidx] != undefined ? page.chatlist[page.chatidx] : "";
                        if(getPrevChat !== "") {
                            $("#write_area").html(getPrevChat);
                        }
                    }
                }
            });
            // .on("focus", "#write_area", function() {
            // $(this).off("cut copy paste");
            // $(this).unbind("cut copy paste");
            // });

            $("#write_area").on("paste", function (e) {
                e.preventDefault();
                try{
                    var a = e.originalEvent.clipboardData || window.clipboardData;
                    $("#write_area").text(a.getData("text"));
                }
                catch(error) {
                }
            });

            $("#chatting_area, #webplayer_top .top_item").append('<a href="#" title="상단 화면 닫기" class="btn_top_remove"></a>');
            $(".btn_top_remove").on("click", function() {
                if($(this).hasClass("active")) {
                    $(".btn_top_remove").removeClass("active");
                    $("body").removeClass("top_remove");
                }
                else {
                    $(".btn_top_remove").addClass("active");
                    $("body").addClass("top_remove");
                }
                page.setCookie("player_header_top",$(this).hasClass("active") ? "on" : "off","",365);
                return false;
            });
            var getHeaderTop = page.getCookie("player_header_top");
            if(getHeaderTop == "on") {
                $(".btn_top_remove").eq(0).trigger("click");
            }

            //공지 펼침
            $("#chatting_area .chat_notice .msg").on("click", function() {
                $(this).parent().find(".btn_chat_notice").trigger("click");
            });
        },
        managerChat: function() {
            //매니저 채팅 고정
            $("#layer_mchat").append("<label class='mchat_check'><input type='checkbox' id='manager_fixed' class='check'>상단 고정</label>");
            $("#manager_fixed").on("click",function() {
                page.style.managerResize();
                page.setCookie("mng_mng_fixed",this.checked,"",365);
            });
            $("#setbox_mchat a, #layer_mchat .btn_close").on("click",function() {
                $(".chatbox .setbox .btnset li.mchat a").removeClass("msg");
                page.style.managerResize();
            });

            //매니저창 상태
            var getMngFixed = page.getCookie("mng_mng_fixed");
            if(getMngFixed && getMngFixed == "true") {
                $("#manager_fixed").prop("checked",true);
            }
        },
        managerResize: function() {
            var managerPopup = $("#layer_mchat");
            if(managerPopup.length > 0) {
                if($("#manager_fixed").is(":checked") && managerPopup.is(":visible") && $("#chatting_area").is(":visible")) {
                    $("#chatting_area").addClass("manager");
                    managerPopup.appendTo($("#chatting_area"));
                }
                else {
                    $("#chatting_area").removeClass("manager");
                    managerPopup.appendTo($("body"));
                }
            }
        },
        menustats: function() {
            //리스트 상태
            var getMenuChat = page.getCookie("player_menu_chat");
            var getMenuArtlist = page.getCookie("player_menu_artlist");
            var getMenuFav = page.getCookie("player_menu_fav");
            if(getMenuChat == "off" && !$("#topmenu_chat a").hasClass("off")) $("#setbox_close a").trigger("click");
            if(getMenuArtlist == "off" && !$("#topmenu_airlist a").hasClass("off")) $(".listbox .headbtn .close a").trigger("click");
            if(getMenuFav == "off" && !$("#topmenu_fav a").hasClass("off")) $(".favbox .headbtn .close a").trigger("click");
        },
        toggle: function(type, target) {
            if($(target).is(":checked")) {
                $(target).parent().addClass("toggle_on").find(".ico").stop(true,true).animate({ left:25 },type ? 100 : 0);
                if($(target).hasClass("expand")) {
                    if($(target).closest(".option_panel").hasClass("active")) $(target).closest(".input_wrap").next(".input_sub").stop(true,true).slideDown(200);
                    else $(target).closest(".input_wrap").next(".input_sub").show();
                }
            }
            else {
                $(target).parent().removeClass("toggle_on");
                $(target).parent().removeClass("toggle_on").find(".ico").stop(true,true).animate({ left:1 },type ? 100 : 0);
                if($(target).hasClass("expand")) {
                    if($(target).closest(".option_panel").hasClass("active")) $(target).closest(".input_wrap").next(".input_sub").stop(true,true).slideUp(200);
                    else $(target).closest(".input_wrap").next(".input_sub").hide();
                }
            }
        }
    },
    //함수 오버라이드
    funcadd: function() {
        var prev_msg = liveView.controller.chatContainer.msg;
        liveView.controller.chatContainer.msg = function() {
            var getChat = prev_msg.apply(this, arguments);
            if(arguments.length > 0) {
                var getData = arguments[0];
                var getId = page.getid(getData.senderID);
                var getName = getData.nickname;
                var getMsg = getData.message;
                if(page.info.use) {
                    page.mngr['msg'](getData);
                }
                if(page.isMe(getId)) {
                    page.chatlist.push(getMsg);
                    if(page.chatlist.length > 10) {
                        page.chatlist = page.chatlist.splice(page.chatlist.length - 10);
                    }
                    page.chatidx = page.chatlist.length - 1;
                    page.chatprev = 0;
                }
                if(getMsg.indexOf("?") > -1) {
                    var getGalMsg = getMsg.replace(/\s/gi,"");
                    if(getGalMsg === "?" || getGalMsg === "??" || getGalMsg === "???" || getGalMsg.replace(/\?/gi, "") === "") {
                        page.galgori.data.count += 1;
                        if(page.galgori.data.userlist[getId] === undefined) {
                            page.galgori.data.userlist[getId] = { name:getName, count:0 };
                        }
                        page.galgori.data.userlist[getId].count += 1;
                        if(page.galgori.data.maxcount < page.galgori.data.userlist[getId].count) {
                            page.galgori.data.maxid = getId;
                            page.galgori.data.maxname = getName;
                            page.galgori.data.maxcount = page.galgori.data.userlist[getId].count;
                        }
                    }
                }
            }
        };

        var prev_ogq = liveView.controller.chatContainer.ogq;
        liveView.controller.chatContainer.ogq = function() {
            var getChat = prev_ogq.apply(this, arguments);
            if(arguments.length > 0) {
                var getData = arguments[0];
                var getId = page.getid(getData.senderID);
                var getName = getData.nickname;
                var getMsg = getData.message;
                if(page.info.use) {
                    getChat = page.mngr['msg'](getData, getChat);
                }
                if(page.isMe(getId)) {
                    page.chatlist.push(getMsg);
                    if(page.chatlist.length > 10) {
                        page.chatlist = page.chatlist.splice(page.chatlist.length - 10);
                    }
                    page.chatidx = page.chatlist.length - 1;
                    page.chatprev = 0;
                }
            }
            return getChat;
        };

        var prev_join_ch = liveView.controller.chatContainer.join_ch;
        liveView.controller.chatContainer.join_ch = function() {
            prev_join_ch.apply(this, arguments);
            var data = arguments[0];
            if(page.log.debug) console.log("mngr join_ch", data);

            var getChangeCheck = false;
            var getChangeId = false;
            var getBjId = page.getid(data.bjID);
            if(page.info.bjid !== "" && page.info.bjid != getBjId) {
                getChangeCheck = true;
            }

            if(liveView.ChatInfo.myUserInfo.bAdmin && liveView.ChatInfo.myUserInfo.szUserId != undefined) {
                data.userID = liveView.ChatInfo.myUserInfo.szUserId;
            }

            if(page.info.id != page.getid(data.userID)) {
                getChangeId = true;
            }
            page.info.bjid = getBjId;
            page.info.id = page.getid(data.userID);
            page.info.flag = page.getFlag();

            //공지
            page.noticeClose();

            //재설정
            if(getChangeCheck === true) {
                page.info.sid = "";
                if(page.isSocket()) {
                    page.socket.emit("mngr", { type:"player", id:page.info.id, bjid:page.info.bjid });
                }
                page.load();
            }
            else {
                page.start();
            }

            if(getChangeId === true) {
                page.load();
            }

            page.mngrload();
        };
        var prev_set_flag = liveView.controller.chatContainer.set_flag;
        liveView.controller.chatContainer.set_flag = function() {
            var data = arguments[0];
            if(page.log.debug) console.log("set_flag", page.info.flag, data);
            page.info.flag = data.flag1;
            page.mngrload();
            prev_set_flag.apply(this, arguments);
        };
        var prev_manager = liveView.controller.chatContainer.manager;
        liveView.controller.chatContainer.manager = function() {
            var data = arguments[0];
            if(page.log.debug) console.log("manager", data);

            var getId = page.getid(data.id);
            if(getId == page.info.id) {
                page.info.flag = data.flag1;
                page.mngrload();
            }
            prev_manager.apply(this, arguments);
        };
        var prev_manager_msg = liveView.controller.chatContainer.manager_msg;
        liveView.controller.chatContainer.manager_msg = function() {
            var mngBtn = $(".chatbox .setbox .btnset li.mchat a");
            if(!mngBtn.hasClass("on")) {
                mngBtn.addClass("msg");
            }
            prev_manager_msg.apply(this, arguments);
        };
        var prev_kickout = liveView.controller.chatContainer.kickout;
        liveView.controller.chatContainer.kickout = function() {
            var data = arguments[0];
            if(page.isUse()) {
                var getId = page.getid(data.id);

                if(page.isManager()) {
                    //블라인드 강퇴 취소
                    if(data.kickType == 4 || data.kickType == 5) {
                        if(page.data.blindcancel === true) {
                            setTimeout(function() {
                                page.chat.kick("kickcancel", { id:data.id, name:data.nickname, type:1, msg:"" });

                                //log("kick",{ type:"kickcancel", bjid:page.info.bjid, id:page.info.id, uid:e.channel.data.id, uname:e.channel.data.nickname });
                            }, 500);
                        }
                    }
                    page.history.run("kick", data);
                }

                //강퇴 채팅 삭제
                if(page.data.kickremove === false) {
                    $("#chat_area dl a[user_id='" + getId + "']").each(function(key, obj) {
                        $(obj).find("em").parent().append(function() {
                            var getEm = $(this).find("em");
                            var getText = getEm.text();
                            getEm.remove();
                            return "<span>" + getText + "</span>";
                        });
                    });
                }
            }
            prev_kickout.apply(this, arguments);
        };
        var prev_dumb = liveView.controller.chatContainer.dumb;
        liveView.controller.chatContainer.dumb = function() {
            var data = arguments[0];
            if(page.isUse() && page.isManager()) {
                page.history.run("dumb", data);
            }
            prev_dumb.apply(this, arguments);
        };
        var prev_join = liveView.controller.chatContainer.join;
        liveView.controller.chatContainer.join = function() {
            if(page.info.use) {
                var getData = arguments[0][0];
                page.mngr['join'](getData);
            }
            prev_join.apply(this, arguments);
        };
        var prev_balloon = liveView.controller.chatContainer.balloon;
        liveView.controller.chatContainer.balloon = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['balloon'](getData);
            }
            prev_balloon.apply(this, arguments);
        };
        var prev_sticker = liveView.controller.chatContainer.sticker;
        liveView.controller.chatContainer.sticker = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['sticker'](getData);
            }
            prev_sticker.apply(this, arguments);
        };
        var prev_chocolate = liveView.controller.chatContainer.chocolate;
        liveView.controller.chatContainer.chocolate = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['chocolate'](getData);
            }
            prev_chocolate.apply(this, arguments);
        };
        var prev_subscription_item_effect = liveView.controller.chatContainer.subscription_item_effect;
        liveView.controller.chatContainer.subscription_item_effect = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['subscription_item_effect'](getData);
            }
            prev_subscription_item_effect.apply(this, arguments);
        };
        var prev_adcon_effect = liveView.controller.chatContainer.adcon_effect;
        liveView.controller.chatContainer.adcon_effect = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['adcon_effect'](getData);
            }
            prev_adcon_effect.apply(this, arguments);
        };
        var prev_direct_receive = liveView.controller.chatContainer.direct_receive;
        liveView.controller.chatContainer.direct_receive = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['direct_receive'](getData);
            }
            prev_direct_receive.apply(this, arguments);
        };
        var prev_direct_send = liveView.controller.chatContainer.direct_send;
        liveView.controller.chatContainer.direct_send = function() {
            if(page.info.use) {
                var getData = arguments[0];
                page.mngr['direct_send'](getData);
            }
            prev_direct_send.apply(this, arguments);
        };

        //귓속말 보내기
        var prev_showChatMenu = liveView.Chat.showChatMenu;
        liveView.Chat.showChatMenu = function(a) {
            var getId = $(a).attr("user_id");
            setTimeout(function() {
                $("#contextChatMenu ul li a:contains('귓속말 보내기')").off("click").on("click",function() {
                    if(page.isUse()) {
                        page.direct.show(getId);
                    }
                    else {
                        $("#write_area").html("/to " + getId + "&nbsp;").focus().focusEnd();
                    }
                    return false;
                });
            }, 10);
            return prev_showChatMenu.apply(this, arguments);
        };
    },

    //신고
    report: {
        list: {},
        data: [],
        run: function(data) {
            if(page.log.debug) console.log("report", data);
            if(page.isManager() && (page.data.autoreportdumb === true || page.data.autoreportkick === true) && data.msg !== "") {
                var getReport = data.msg.split(" ");
                if(getReport.length > 1 && getReport[0] == "!신고" && getReport[1] !== "") {
                    var getReportId = getReport[1];
                    var getReportName = "";
                    var getChat = [];
                    var getReportList = $("#chat_area dl a[user_id='" + getReportId + "']");

                    if(getReportList.length > 0) {
                        getReportName = getReportList.eq(0).attr("user_nick");

                        getReportList.slice(-30).each(function() {
                            getChat.push($(this).closest("dl").find("dd").text());
                        });

                        if(page.report.list[getReportId] == undefined) {
                            page.report.list[getReportId] = { name:getReportName, count:1, chat:[], stats:"", reportlist:[data.id] };
                        }
                        else {
                            if($.inArray(data.id, page.report.list[getReportId].reportlist) == -1) {
                                page.report.list[getReportId].reportlist.push(data.id);
                            }
                            else {
                                return;
                            }
                            page.report.list[getReportId].count += 1;
                        }
                        if(getChat.length > 0) {
                            page.report.list[getReportId].chat = getChat;
                        }

                        var getReportType = "";
                        if(page.data.autoreportdumb === true && !isNaN(page.data.autoreportdumbcnt) && Number(page.data.autoreportdumbcnt) > 0 && page.report.list[getReportId].count >= Number(page.data.autoreportdumbcnt) && page.report.list[getReportId].stats === "") {
                            getReportType = "dumb";
                            page.report.list[getReportId].stats = "dumb";
                        }
                        if(page.data.autoreportkick === true && !isNaN(page.data.autoreportkickcnt) && Number(page.data.autoreportkickcnt) > 0 && page.report.list[getReportId].count >= Number(page.data.autoreportkickcnt)) {
                            getReportType = "kick";
                            page.report.list[getReportId].stats = "kick";
                        }

                        if(page.log.debug) console.log("report", page.report.list, getReportType);
                        if(getReportType !== "") {
                            var getKickData = { id:getReportId, name:getReportName, type:"", msg:"" };
                            if(getReportType == "kick") getKickData.type = 0;
                            page.chat.kick(getReportType, getKickData);
                            page.report.data.push(JSON.stringify(page.report.list[getReportId]));
                            page.history.save("save");
                            if((getReportType == "dumb" && page.data.autoreportkick !== true) || getReportType == "kick") {
                                page.report.list[getReportId] = undefined;
                                delete page.report.list[getReportId];
                            }

                            log("reportkick",{ type:"reportkick", bjid:page.info.bjid, id:page.info.id, uid:getReportId, uname:getReportName });
                        }
                    }
                }
            }
        }
    },

    //히스토리
    history: {
        list: { kick: [], dumb: [], blind: [], report:[] },
        init: function() {
            var getPrevDay = new Date(new Date().getTime() - 7*24*60*60*1000);
            var getPrevDate = getPrevDay.getFullYear().toString() + (getPrevDay.getMonth() + 1 < 10?"0":"") + (getPrevDay.getMonth() + 1).toString() + (getPrevDay.getDate() < 10?"0":"") + getPrevDay.getDate().toString();
            $.each(localStorage,function(key,value) {
                if(key.indexOf("historykick_") > -1 || key.indexOf("historydumb_") > -1 || key.indexOf("historybadge_") > -1 || key.indexOf("historyreport_") > -1) {
                    var getDay = key.split("_").pop();
                    if(Number(getDay) < Number(getPrevDate)) {
                        localStorage.removeItem(key);
                    }
                }
            });
        },
        run: function(type, data) {
            if(page.isManager()) {
                var getId = page.getid(data.id);
                if(getId === null || getId === undefined || getId === "") return;

                var getBtn = $("#mngr_menu .btn_addmenu_" + (type == "kick" || type == "blind" ? "kick" : type));
                var getBadge = getBtn.find(".badge");
                var getCount = parseInt(getBadge.text(),10);
                if(isNaN(getCount)) getCount = 0;
                getBadge.html(getCount + 1).show();

                var getType = type == "kick" || type == "blind" ? "kick" : type;
                var getChat = [];
                $("#chat_area dl a[user_id='" + getId + "']").slice(-10).each(function() {
                    getChat.push($(this).closest("dl").find("dd").text());
                });

                var getAddChat = {
                    id:getId,
                    nick:data.nickname,
                    type:type,
                    kicktype:getType == "kick" && data.kickType ? data.kickType : "",
                    time:page.timeFormat("day") + " " + page.timeFormat("time"),
                    chat:getChat
                };
                page.history.list[getType].push(getAddChat);
                page.history.save("save");
            }
        },
        save: function(type) {
            if('localStorage' in window && window['localStorage'] !== null) {
                if(type == "save" && page.info.bjid != "") {
                    var getKickBadge = $(".btn_addmenu_kick .badge").text();
                    var getDumbBadge = $(".btn_addmenu_dumb .badge").text();
                    var getDay = page.timeFormat("date");
                    var getPrevHistory = localStorage.getItem("historybadge_" + page.info.bjid + "_" + getDay);

                    if(getPrevHistory == null ) {
                        if(page.history.list.kick.length > 0) {
                            page.history.list.kick = [page.history.list.kick.pop()];
                        }
                        if(page.history.list.dumb.length > 0) {
                            page.history.list.dumb = [page.history.list.dumb.pop()];
                        }
                    }
                    var getHistoryKick = JSON.stringify(page.history.list.kick);
                    var getHistoryDumb = JSON.stringify(page.history.list.dumb);
                    var getHistoryReport = JSON.stringify(page.report.data);

                    localStorage.setItem("historybadge_" + page.info.bjid + "_" + getDay, getKickBadge+","+getDumbBadge);
                    if(page.history.list.kick.length > 0) localStorage.setItem("historykick_" + page.info.bjid + "_" + getDay, getHistoryKick);
                    if(page.history.list.dumb.length > 0) localStorage.setItem("historydumb_" + page.info.bjid + "_" + getDay, getHistoryDumb);
                    if(page.report.data.length > 0) localStorage.setItem("historyreport_" + page.info.bjid + "_" + getDay, getHistoryReport);
                }
                else if(type == "load" && page.info.bjid != "") {
                    var getDay = page.timeFormat("date");
                    var getHistoryKick = localStorage.getItem("historykick_" + page.info.bjid + "_" + getDay);
                    var getHistoryDumb = localStorage.getItem("historydumb_" + page.info.bjid + "_" + getDay);
                    var getHistoryBadge = localStorage.getItem("historybadge_" + page.info.bjid + "_" + getDay);
                    var getHistoryReport = localStorage.getItem("historyreport_" + page.info.bjid + "_" + getDay);

                    if(getHistoryBadge && getHistoryBadge != "") {
                        var badgeArray = getHistoryBadge.split(",");
                        if(badgeArray[0] && badgeArray[0] != "") $(".btn_addmenu_kick .badge").html(badgeArray[0]).show();
                        if(badgeArray[1] && badgeArray[1] != "") $(".btn_addmenu_dumb .badge").html(badgeArray[1]).show();
                    }
                    else {
                        $(".btn_addmenu_kick .badge, .btn_addmenu_dumb .badge").html("").hide();
                    }

                    if(getHistoryKick && getHistoryKick != "") {
                        page.history.list.kick = $.parseJSON(getHistoryKick);
                    }
                    if(getHistoryDumb && getHistoryDumb != "") {
                        page.history.list.dumb = $.parseJSON(getHistoryDumb);
                    }
                    if(getHistoryReport && getHistoryReport != "") {
                        page.report.data = $.parseJSON(getHistoryReport);
                    }

                    //7일 이후 삭제
                    var localData = [];
                    var localName = "historybadge_" + page.info.bjid + "_";
                    $.each(localStorage,function(key, value) {
                        if(key.indexOf(localName) > -1) {
                            localData.push(key.replace(localName,""));
                        }
                    });

                    if(localData.length > 0) {
                        var getPrevDay = new Date(new Date().getTime() - 7*24*60*60*1000);
                        var getPrevDate = getPrevDay.getFullYear().toString() + (getPrevDay.getMonth() + 1 < 10?"0":"") + (getPrevDay.getMonth() + 1).toString() + (getPrevDay.getDate() < 10?"0":"") + getPrevDay.getDate().toString();
                        localData.sort();
                        $.each(localData,function(key,value) {
                            if(Number(value) < Number(getPrevDate)) {
                                localStorage.removeItem("historykick_" + page.info.bjid + "_" + value);
                                localStorage.removeItem("historydumb_" + page.info.bjid + "_" + value);
                                localStorage.removeItem("historybadge_" + page.info.bjid + "_" + value);
                                localStorage.removeItem("historyreport_" + page.info.bjid + "_" + value);
                            }
                        });
                    }
                }
            }
        },
        view: function(type, sid) {
            if(page.isManager()) {
                var getDay = page.timeFormat("date");
                var getHistoryId = page.info.bjid;
                var getHistoryList = [];
                var localName = "historybadge_" + getHistoryId + "_";
                $.each(localStorage,function(key, value) {
                    if(key.indexOf(localName) > -1) {
                        getHistoryList.push(key.replace(localName,""));
                    }
                });

                var getDumbData = [];
                var getKickData = [];
                if(getHistoryList) {
                    if($("#history_popup").length == 0) {
                        $("body").append('<div id="history_mask"></div><div id="history_popup">' +
                                         '<div class="header_wrap"><p class="bjid"></p><div class="search_wrap"><select title="검색 타입 선택" class="select_search"><option value="id">아이디로 검색</option><option value="name">닉네임으로 검색</option></select><input type="text" placeholder="아이디를 입력해주세요." class="input_search" value=""><a href="#" class="btns btn_search">검색</a></div><a href="#" class="btns btn_history_reset">초기화</a><a href="#" class="btns btn_history_close">닫기</a></div>' +
                                         '<div class="file_wrap"><div class="list_box"><p class="title">리스트</p><div class="scroll_wrap"><ul id="history_filelist" class="list"></ul></div></div></div>' +
                                         '<div class="history_wrap">' +
                                         '<div class="kick_wrap"><div class="list_box"><div class="tab"><a href="#" class="btn_kick active">강퇴 내용<span class="number"></span></a><a href="#" class="btn_dumb">채팅금지 내용<span class="number"></span></a></div><div class="scroll_wrap kick on"><ul id="history_kick_list" class="list history_list"><li><p class="list_no">검색결과가 없습니다.</p></li></ul></div><div class="scroll_wrap dumb"><ul id="history_dumb_list" class="list history_list"><li><p class="list_no">검색결과가 없습니다.</p></li></ul></div></div></div>' +
                                         '<div class="detail_wrap"><div class="list_box"><p class="title">채팅 내용</p><div id="history_chat_detail" class="scroll_wrap"><div id="history_chat_area" class="history_chat_area"></div></div></div></div>' +
                                         '</div></div>');

                        $("#history_popup .kick_wrap .tab a").on("click",function() {
                            if($(this).hasClass("active")) return false;
                            $("#history_popup .kick_wrap .tab a").removeClass("active");
                            var getIdx = $(this).addClass("active").index();
                            $("#history_popup .kick_wrap .scroll_wrap").removeClass("on").eq(getIdx).addClass("on");
                            return false;
                        });

                        var historyChatArea = $("#history_chat_area");
                        function historyChatView(target, chatdata) {
                            var removeCheck = false;
                            if($(target).is("input")) {
                                if(!$(target).is(":checked")) {
                                    var getList = $(target).parent().find("a").removeClass("active").data("list");
                                    if(getList) {
                                        getList.remove();
                                    }
                                    return;
                                }
                                else {
                                    if($("#history_popup .history_list .check:checked").length == 1) removeCheck = true;
                                }
                            }

                            if(chatdata.type == "kick") {
                                var getType = "강퇴 내용";
                                if(chatdata.kicktype && chatdata.kicktype == 3) getType = "채팅금지 횟수 초과 강퇴 내용";
                                else if(chatdata.kicktype && chatdata.kicktype == 4) getType = "무분별한 도배 강퇴 내용";
                                else if(chatdata.kicktype && chatdata.kicktype == 5) getType = "블라인드 강퇴 내용";
                            }
                            else if(chatdata.type == "blind") var getType = "블라인드 강퇴 내용";
                            else if(chatdata.type == "dumb") var getType = "채팅금지 내용";
                            var listArray = ["<li class='detail_title'><b>[" + chatdata.time + "]</b> " + chatdata.nick + "(" + chatdata.id + ") <b class='type'>" + getType + "</b></li>"];

                            $.each(chatdata.chat,function(key,value) {
                                if(value != "") listArray.push('<li>' + value + '</li>');
                            });

                            if(removeCheck || $(target).is("a")) {
                                historyChatArea.empty();
                                $("#history_popup .history_list .active").removeClass("active").parent().find(".check").prop("checked",false);
                                if($(target).is("a")) {
                                    $(target).parent().find(".check").prop("checked",true);
                                }
                            }
                            var getDetailList = $("<ul class='list'>" + listArray.join("") + "</ul>");
                            $(target).parent().find("a").addClass("active").data("list", getDetailList);
                            historyChatArea.append(getDetailList);
                        }

                        function historyListView(type,file) {
                            var historyDumbList = $("#history_dumb_list").html("<li><p class='list_no'>검색결과가 없습니다.</p></li>");
                            var historyKickList = $("#history_kick_list").html("<li><p class='list_no'>검색결과가 없습니다.</p></li>");
                            var historyTabNumber = $("#history_popup .kick_wrap .tab .number").html("");
                            $("#history_chat_area").empty();
                            getDumbData = [];
                            getKickData = [];

                            if(type == "file") {
                                $("#history_popup .input_search").val("");
                                var getHistoryDumb = localStorage.getItem("historydumb_" + file);
                                var getHistoryKick = localStorage.getItem("historykick_" + file);

                                if(getHistoryDumb != null && getHistoryDumb != "") getDumbData = $.parseJSON(getHistoryDumb);
                                if(getHistoryKick != null && getHistoryKick != "") getKickData = $.parseJSON(getHistoryKick);
                            }
                            else if(type == "search") {
                                $("#history_filelist a.active").removeClass("active");
                                var historySearchVal = $("#history_popup .input_search").val();
                                var historySearchType = $("#history_popup .select_search").val();
                                $.each(getHistoryList.sort().reverse(), function(key,value) {
                                    var getSearchDumb = localStorage.getItem("historydumb_" + getHistoryId + "_" + value);
                                    var getSearchKick = localStorage.getItem("historykick_" + getHistoryId + "_" + value);
                                    if(getSearchDumb != null && getSearchDumb != "") {
                                        var getSearchDumbData = $.parseJSON(getSearchDumb);
                                        if(getSearchDumbData.length > 0) {
                                            $.each(getSearchDumbData,function(keys,values) {
                                                if((historySearchType == "id" && values.id.indexOf(historySearchVal) > -1) || (historySearchType == "name" && values.nick.indexOf(historySearchVal) > -1)) {
                                                    getDumbData.push(values);
                                                }
                                            });
                                        }
                                    }
                                    if(getSearchKick != null && getSearchKick != "") {
                                        var getSearchKickData = $.parseJSON(getSearchKick);
                                        if(getSearchKickData.length > 0) {
                                            $.each(getSearchKickData,function(keys,values) {
                                                if((historySearchType == "id" && values.id.indexOf(historySearchVal) > -1) || (historySearchType == "name" && values.nick.indexOf(historySearchVal) > -1)) {
                                                    getKickData.push(values);
                                                }
                                            });
                                        }
                                    }
                                });
                            }

                            if(getDumbData.length > 0) {
                                historyTabNumber.eq(1).html("(" + getDumbData.length + ")");
                                historyDumbList.empty();
                                $.each(getDumbData.reverse(),function(key,value) {
                                    var getType = "<b class='type'>채팅금지</b> 되었습니다.";
                                    historyDumbList.append('<li data-id="' + value.id + '" data-idx="' + key + '" data-type="dumb"><input type="checkbox" class="check"><a href="#"><b class="time">[' + value.time + ']</b> ' + value.nick + '(' + value.id + ') 님이 ' + getType + '</a></li>');
                                });
                            }

                            if(getKickData.length > 0) {
                                historyTabNumber.eq(0).html("(" + getKickData.length + ")");
                                historyKickList.empty();
                                $.each(getKickData.reverse(),function(key,value) {
                                    if(value.type == "kick") {
                                        var getType = "<b class='type'>강제퇴장</b> 당하셨습니다.";
                                        if(value.kicktype && value.kicktype == 3) getType = "<b class='type'>채팅금지 횟수 초과로 강제퇴장</b> 당하셨습니다.";
                                        else if(value.kicktype && value.kicktype == 4) getType = "<b class='type'>무분별한 도배로 강제퇴장</b> 당하셨습니다.";
                                        else if(value.kicktype && value.kicktype == 5) getType = "<b class='type'>블라인드 상태에서 탈출 시도로 강제퇴장</b> 당하셨습니다.";
                                    }
                                    else var getType = "<b class='type'>블라인드 탈출 시도로 강제퇴장</b> 처리되었습니다.";
                                    historyKickList.append('<li data-id="' + value.id + '" data-idx="' + key + '" data-type="kick"><input type="checkbox" class="check"><a href="#"><b class="time">[' + value.time + ']</b> ' + value.nick + '(' + value.id + ') 님이 ' + getType + '</a></li>');
                                });
                            }
                        }
                        $("#history_popup").on("click","#history_filelist a",function() {
                            if($(this).hasClass("active")) return false;
                            $("#history_filelist a.active").removeClass("active");
                            $(this).addClass("active");
                            var getFile = $(this).data("file");
                            historyListView("file", getFile);
                            return false;
                        }).on("click",".history_list a",function() {
                            var getIdx = $(this).parent().data("idx");
                            var getId = $(this).parent().data("id");
                            var getType = $(this).parent().data("type");
                            var getChat = getType == "dumb" ? getDumbData[getIdx] : getKickData[getIdx];
                            if(getChat != undefined && getChat.id == getId) {
                                historyChatView(this,getChat);
                            }
                            return false;
                        }).on("change",".history_list .check",function() {
                            var getIdx = $(this).parent().data("idx");
                            var getId = $(this).parent().data("id");
                            var getType = $(this).parent().data("type");
                            var getChat = getType == "dumb" ? getDumbData[getIdx] : getKickData[getIdx];
                            if(getChat != undefined && getChat.id == getId) {
                                historyChatView(this,getChat);
                            }
                            return false;
                        });

                        var historySearchBtn = $("#history_popup .btn_search").on("click",function() {
                            var getSearch = $("#history_popup .input_search").val();
                            if(getSearch != "") {
                                historyListView("search");
                            }
                            else $("#history_popup .input_search").focus();
                            return false;
                        });
                        $("#history_popup .input_search").on("keyup",function(e) {
                            if(e.keyCode == 13) {
                                historySearchBtn.trigger("click");
                            }
                        });

                        $("#history_popup .btn_history_close").on("click",function() {
                            $("#history_mask").stop(true,true).animate({ opacity:0 },200,function() {
                                $(this).hide();
                                $("#history_filelist, #history_kick_list, #history_dumb_list, #history_chat_area").empty();
                                $("#history_popup .input_search").val("");
                                $("#history_popup .kick_wrap .tab .number").html("");
                            });
                            $("#history_popup").stop(true,true).fadeOut(200);
                            return false;
                        });

                        $("#history_popup .btn_history_reset").on("click",function() {
                            if(confirm("강퇴, 채금 리스트를 초기화 하시겠습니까?")) {
                                $.each(localStorage,function(key,value) {
                                    if(key.indexOf("historykick_" + page.info.bjid) > -1 || key.indexOf("historydumb_" + page.info.bjid) > -1 || key.indexOf("historybadge_" + page.info.bjid) > -1 || key.indexOf("historyreport_" + page.info.bjid) > -1) {
                                        localStorage.removeItem(key);
                                    }
                                });
                                $(".btn_addmenu_kick .badge, .btn_addmenu_dumb .badge").html("").hide();
                                $("#history_popup .btn_history_close").trigger("click");
                            }

                            return false;
                        });

                        var historyPopup = $("#history_popup");
                        function popupResize() {
                            var getWidth = $(window).width();
                            var getHeight = $(window).height();
                            if(getWidth < 1020) historyPopup.addClass("fixwidth");
                            else historyPopup.removeClass("fixwidth");
                            if(getHeight < 620) historyPopup.addClass("fixheight");
                            else historyPopup.removeClass("fixheight");
                        }
                        $(window).on("resize",function() {
                            popupResize();
                        });
                        popupResize();
                    }

                    $("#history_chat_area").empty();
                    $("#history_popup .bjid").html(getHistoryId);
                    var historyFileList = $("#history_filelist").empty();
                    $.each(getHistoryList.sort().reverse(), function(key,value) {
                        historyFileList.append('<li><a href="#" data-file="' + getHistoryId + '_' + value + '"><span>▶</span>' + value.substr(0,4) + '년 ' + value.substr(4,2) + '월 ' + value.substr(6,2) + '일</a></li>');
                    });

                    $("#history_popup .kick_wrap .tab a").eq(type == "kick" ? 0 : 1).trigger("click");
                    $("#history_mask").stop(true,true).show().animate({ opacity:0.5 },200);
                    $("#history_popup").stop(true,true).fadeIn(200, function() {
                        if(sid == "") $("#history_filelist a:eq(0)").trigger("click");
                        else {
                            $("#history_popup .input_search").val(sid);
                            $("#history_popup .btn_search").trigger("click");
                        }
                    });
                }
            }
        }
    },

    galgori: {
        data: { time: 0, count: 0, maxid: "", maxname:"", maxcount: 0, userlist:{} },
        init: function() {
            page.galgori.data.time = new Date().getTime();
        }
    },

    cmdtool: {
        init: function() {
            //메뉴 설정
            if($("#mngr_cmd_popup").length == 0) {
                $("body").append('<div id="mngr_cmd_popup"> <div class="popup_area"> <div class="popup_header"> <div class="tab_menu"> <a href="#" class="btn btn_tab active"><i class="fas fa-bullhorn"></i>공지</a> <a href="#" class="btn btn_tab"><i class="far fa-clock"></i>타이머</a> <a href="#" class="btn btn_tab"><i class="fas fa-poll-h"></i>투표</a> </div> <a href="#" class="btn btn_close"><i class="fas fa-times"></i>닫기</a> </div> <div class="popup_content"> <div class="tab_area tab_notice active"> <ul class="input_list"> <li class="input_box"> <p class="label">공지 설정</p> <a href="#" data-type="now" class="btn btn_notice">현재시간</a> <a href="#" data-type="uptime" class="btn btn_notice">방송시간</a> <a href="#" data-type="delete" class="btn btn_notice btn_delete"><i class="fas fa-times"></i>공지삭제</a> </li> <li class="input_box input_box_notice"> <p class="label">공지 내용</p> <input type="text" placeholder="공지내용" class="input_text input_notice"> <a href="#" data-type="notice" class="btn btn_notice btn_start"><i class="fas fa-bullhorn"></i>공지설정</a> </li> </ul> </div> <div class="tab_area tab_timer"> <ul class="input_list"> <li class="input_box"> <p class="label">타이머 설정</p> <a href="#" data-type="now" class="btn btn_time">현재시간</a> <a href="#" data-type="uptime" class="btn btn_time">방송시간</a> <a href="#" data-type="pause" class="btn btn_time btn_pause">일시정지</a> <a href="#" data-type="restart" class="btn btn_time btn_restart">재시작</a> <a href="#" data-type="delete" class="btn btn_time btn_delete"><i class="fas fa-times"></i>타이머삭제</a> </li> <li class="input_box"> <p class="label">타이머 입력</p> <div class="time_box"> <a href="#" data-time="60" data-timer="1분" title="1분 카운트다운" data-type="countdown" class="btn btn_time"><i class="fas fa-history"></i>1분</a> <a href="#" data-time="300" data-timer="5분" title="5분 카운트다운" data-type="countdown" class="btn btn_time"><i class="fas fa-history"></i>5분</a> <a href="#" data-time="600" data-timer="10분" title="10분 카운트다운" data-type="countdown" class="btn btn_time"><i class="fas fa-history"></i>10분</a> <a href="#" data-time="3600" data-timer="1시간" title="1시간 카운트다운" data-type="countdown" class="btn btn_time"><i class="fas fa-history"></i>1시간</a> </div> <div class="time_box"> <a href="#" data-time="10" data-timer="10초" title="10초 추가" data-type="add" class="btn btn_time"><i class="fa fa-plus-circle" aria-hidden="true"></i>10초</a> <a href="#" data-time="60" data-timer="1분" title="1분 추가" data-type="add" class="btn btn_time"><i class="fa fa-plus-circle" aria-hidden="true"></i>1분</a> <a href="#" data-time="600" data-timer="10분" title="10분 추가" data-type="add" class="btn btn_time"><i class="fa fa-plus-circle" aria-hidden="true"></i>10분</a> <a href="#" data-time="3600" data-timer="1시간" title="1시간 추가" data-type="add" class="btn btn_time"><i class="fa fa-plus-circle" aria-hidden="true"></i>1시간</a> </div> </li> </ul> </div> <div class="tab_area tab_vote"> <ul class="input_list"> <li class="input_box input_box_vote"> <p class="label">투표 설정</p> <a href="#" data-type="restart" title="이전에 설정한 투표 재시작" class="btn btn_vote">재시작</a> <a href="#" data-type="end" title="투표 끝내고 결과 보기" class="btn btn_vote">결과보기</a> <a href="#" data-type="delete" class="btn btn_vote btn_delete"><i class="fas fa-times"></i>투표삭제</a> <a href="#" data-type="start" class="btn btn_vote btn_start"><i class="fas fa-poll-h"></i>투표시작</a> </li> <li class="input_box input_box_time"> <p class="label">투표 시간</p> <input type="text" placeholder="10" class="input_text input_time"><p class="unit">초</p> </li> <li class="input_box input_box_name"> <p class="label">투표 내용</p> <input type="text" placeholder="투표내용 입력" class="input_text input_name"> </li> <li class="input_box vote_scroll"> <p class="label">투표 항목</p> <ul class="vote_list"> <li class="list_box"> <p class="label">1번</p> <input type="text" placeholder="투표항목 입력" class="input_text input_vote"> <a href="#" class="btn btn_add"><i class="fa fa-plus"></i>추가</a> <a href="#" class="btn btn_delete"><i class="fa fa-minus"></i>삭제</a> </li> </ul> <p class="desc">※ 투표는 채팅창에 숫자를 입력하여 참여할 수 있습니다.</p> </li> </ul> </div> </div> <p class="popup_desc">※ 아프리카도우미 채팅창을 이용 중이어야 사용가능합니다.</p> </div> </div>');
            }

            $("#mngr_cmd_popup .btn_close").on("click", function() {
                $("#mngr_cmd_popup").stop(true,true).fadeOut(200);
                return false;
            });

            $("#mngr_cmd_popup .tab_menu .btn_tab").on("click", function() {
                $("#mngr_cmd_popup .tab_menu .btn_tab").removeClass("active");
                var getIdx = $(this).addClass("active").index();
                $("#mngr_cmd_popup .tab_area").removeClass("active").eq(getIdx).addClass("active");
                return false;
            });

            var getVote = $("#mngr_cmd_popup .vote_list .list_box").eq(0).clone();
            var voteList = $("#mngr_cmd_popup .vote_list");
            $("#mngr_cmd_popup").on("click", ".vote_list .btn", function() {
                var getType = $(this).hasClass("btn_add") ? "add" : "delete";
                if(getType === "add") {
                    if(voteList.find(".list_box").length > 8) {
                        alert("9개 이상 추가할 수 없습니다.");
                    }
                    else {
                        getVote.clone().insertAfter($(this).closest(".list_box"));
                        voteList.find(".list_box").last().find(".input_text").focus();
                    }
                }
                else {
                    if(voteList.find(".list_box").length > 1) {
                        $(this).closest(".list_box").remove();
                    }
                    else {
                        voteList.find(".list_box").find(".input_text").val("");
                    }
                }
                voteList.find(".list_box").each(function(key) {
                    $(this).find(".label").html((key + 1)+"번");
                });

                return false;
            });

            //공지사항
            $("#mngr_cmd_popup .tab_notice .btn_notice").on("click", function() {
                var getType = $(this).data("type");
                var getMsg = "";
                var getNotice = $("#mngr_cmd_popup .tab_notice .input_notice").val();
                if(getType == "now") getMsg = "!공지/시간";
                else if(getType == "uptime") getMsg = "!공지/{방송시간}";
                else if(getType == "delete") getMsg = "!공지삭제";
                else if(getType == "notice") {
                    if(getNotice == "") {
                        alert("공지내용을 입력해주세요.");
                        return false;
                    }
                    getMsg = "!공지/" + getNotice;
                }
                if(getMsg !== "'") page.chat.msg("cmd", getMsg);
                return false;
            });

            //타이머
            $("#mngr_cmd_popup .tab_timer .btn_time").on("click", function() {
                var getType = $(this).data("type");
                var getMsg = "";
                if(getType == "now") getMsg = "!시간";
                else if(getType == "uptime") getMsg = "!시간/방송시간";
                else if(getType == "delete") getMsg = "!시간삭제";
                else if(getType == "pause") {
                    $("#mngr_cmd_popup .tab_timer").addClass("pause");
                    getMsg = "!시간정지";
                }
                else if(getType == "restart") {
                    $("#mngr_cmd_popup .tab_timer").removeClass("pause");
                    getMsg = "!시간시작";
                }
                else if(getType == "countdown") {
                    getMsg = "!시간/" + $(this).data("time");
                }
                else if(getType == "add") {
                    getMsg = "!시간/추가/" + $(this).data("time");
                }
                if(getMsg !== "'") page.chat.msg("cmd", getMsg);
                return false;
            });

            //투표
            $("#mngr_cmd_popup .tab_vote .input_time").on("keyup", function(e) {
                if(e.keyCode == 8 || e.keyCode == 16 || e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 45 || e.keyCode == 46 || (e.ctrlKey === true && e.keyCode == 65)) {
                    return true;
                }
                this.value = this.value.replace(/[^0-9]/g,'');
            });

            $("#mngr_cmd_popup .tab_vote .btn_vote").on("click", function() {
                var getType = $(this).data("type");
                var getMsg = "";
                if(getType == "restart") getMsg = "!투표시작";
                else if(getType == "end") getMsg = "!투표종료";
                else if(getType == "delete") getMsg = "!투표삭제";
                else if(getType == "start") {
                    var getTime = $("#mngr_cmd_popup .tab_vote .input_time").val();
                    var getVoteTime = 10;
                    if(getTime !== "" && !isNaN(getTime) && Number(getTime) > 10) {
                        getVoteTime = getTime;
                    }
                    var getDesc = $("#mngr_cmd_popup .tab_vote .input_name").val();
                    var getVoteDesc = "";
                    if(getDesc !== "") {
                        getVoteDesc = "/" + getDesc;
                    }
                    var getVoteList = [];
                    var voteIdx = 0;
                    var voteCheck = true;
                    $("#mngr_cmd_popup .tab_vote .vote_list .input_vote").each(function(key) {
                        var getText = $(this).val();
                        if(getText !== "") {
                            if(getText.indexOf(",") > -1 || getText.indexOf("~") > -1) {
                                alert("투표항목에 , 또는 ~ 는 입력할 수 없습니다.");
                                voteCheck = false;
                                return false;
                            }
                            voteIdx += 1;
                            getVoteList.push((voteIdx) + ":" + getText);
                        }
                    });
                    if(voteCheck == false) return false;

                    if(getVoteList.length > 0) {
                        getMsg = "!투표설정/" + getVoteList.join(",") + "/" + getVoteTime + getVoteDesc;
                    }
                    else {
                        getMsg = "!투표시작";
                    }
                }

                if(getMsg !== "'") page.chat.msg("cmd", getMsg);
                return false;
            });
        }
    },

    //별풍선 기능
    balloon: {
        interval: null,
        statsinterval: null,
        useinterval: null,
        usecheck: true,
        usetime: 0,
        init: function() {
            //send_area
            if(!$("#layerStarGiftNew .tab1 .send_area").hasClass("add")) {
                var getPopupGift = $("#layerStarGiftNew .tab1 .send_area").addClass("add");
                $("<div class='text_box'><p class='gift_title'><i class='fa fa-commenting-o' aria-hidden='true'></i>채팅 메시지</p><textarea class='gift_box'></textarea></div>").insertBefore(getPopupGift.find(".btn_area"));
                $("#layerStarGiftNew .tab1 .send_area .gift_at > dt").prepend('<i class="fa fa-star" aria-hidden="true"></i>');
                $("#layerStarGiftNew .tab1 .send_area .btn_area").prepend('<button class="btn_gifts">연속 선물</button>');
                var giftsPopup = '<div class="gifts_popup">' +
                    '<div class="gifts_tab"><a href="#" data-tab="doosan" class="btn_tab tab_01 active">두산 선물하기</a><a href="#" data-tab="continue" class="btn_tab tab_02">반복 선물하기</a></div><a href="#" class="btn_gifts_close">닫기</a>' +
                    '<div class="gifts_content">' +
                    '<div class="gifts_panel doosan active">' +
                    '<p class="txt_info"><i class="fa fa-info-circle" aria-hidden="true"></i>시작 부터 끝 개수까지 1개씩 증가하며 선물합니다.</p>' +
                    '<table class="gifts_table"><tbody>' +
                    '<tr><th>선물할 개수</th><td><p class="label">시작:</p><input type="text" data-def="1" class="input_gifts gifts_start" value="1"><p class="label"> &nbsp;&nbsp;&nbsp; 끝:</p><input type="text" data-def="10" class="input_gifts gifts_end" value="10"></td></tr>' +
                    '<tr><th>선물 딜레이</th><td><select data-def="500" class="select_time gifts_time"><option value="200">0.2초</option><option value="500" selected="selected">0.5초</option><option value="1000">1초</option><option value="2000">2초</option><option value="3000">3초</option><option value="5000">5초</option><option value="7000">7초</option><option value="10000">10초</option><option value="20000">20초</option><option value="30000">30초</option><option value="60000">1분</option></select><p class="label">(딜레이 초마다 선물)</p></td></tr>' +
                    '</tbody></table>' +
                    '<div class="gifts_info"><p class="gifts_number">보유 별풍선 <b>0</b>개</p><p class="gifts_total">필요 별풍선 <b>0</b>개<span class="error"><em></em>보유 별풍선 부족</span></p><a href="#" class="btn_gifts_buy">구매</a></div>' +
                    '<div class="btn_area"><button class="btn_gifts_gift">선물하기</button><button class="btn_gifts_cancel">취소</button></div>' +
                    '<p class="txt_info"><i class="fa fa-info-circle" aria-hidden="true"></i>연속선물 취소는 채팅창 하단의 선물취소를 누르거나 웹플레이어를 새로고침 해주세요.</p>' +
                    '</div>' +
                    '<div class="gifts_panel continue">' +
                    '<p class="txt_info"><i class="fa fa-info-circle" aria-hidden="true"></i>개수를 횟수만큼 반복해서 선물합니다.</p>' +
                    '<table class="gifts_table"><tbody>' +
                    '<tr><th>선물할 개수</th><td><p class="label">개수:</p><input type="text" data-def="10" class="input_gifts gifts_number" value="10"><p class="label"> &nbsp;&nbsp;&nbsp; 횟수:</p><input type="text" data-def="10" class="input_gifts gifts_count" value="10"></td></tr>' +
                    '<tr><th>선물 딜레이</th><td><select data-def="500" class="select_time gifts_time"><option value="200">0.2초</option><option value="500" selected="selected">0.5초</option><option value="1000">1초</option><option value="2000">2초</option><option value="3000">3초</option><option value="5000">5초</option><option value="7000">7초</option><option value="10000">10초</option><option value="20000">20초</option><option value="30000">30초</option><option value="60000">1분</option></select><p class="label">(딜레이 초마다 선물)</p></td></tr>' +
                    '</tbody></table>' +
                    '<div class="gifts_info"><p class="gifts_number">보유 별풍선 <b>0</b>개</p><p class="gifts_total">필요 별풍선 <b>0</b>개<span class="error"><em></em>보유 별풍선 부족</span></p><a href="#" class="btn_gifts_buy">구매</a></div>' +
                    '<div class="btn_area"><button class="btn_gifts_gift">선물하기</button><button class="btn_gifts_cancel">취소</button></div>' +
                    '<p class="txt_info"><i class="fa fa-info-circle" aria-hidden="true"></i>연속선물 취소는 채팅창 하단의 선물취소를 누르거나 웹플레이어를 새로고침 해주세요.</p>' +
                    '</div></div></div>';
                $("#layerStarGiftNew .tab1 .send_area").append(giftsPopup);

                $("#actionbox").prepend('<div id="gifts_stats" class="gifts_stats"><p class="doosan"><b class="total">0</b>두산 중 <b class="count">0</b>두산</p><p class="continue"><b class="total">0</b>회 중 <b class="count">0</b>회</p><a href="#" class="btn_cancel">선물취소</a></div>');

                //연속 선물 팝업 열기
                $("#layerStarGiftNew .btn_gifts").on("click", function() {
                    if(page.opt.giftcontinue !== true) return;


                    var giftsCookie = page.getCookie("gifts_agree");
                    if(giftsCookie === "agree" || confirm("테스트 및 주의가 필요한 기능입니다.\r\이용 목적 및 취소 방법 등에 대해 미리 숙지해주세요.\r\n연속 선물하기 기능을 사용하시겠습니까?")) {
                        page.setCookie("gifts_agree","agree","",365);

                        $("#layerStarGiftNew .gifts_popup").stop(true,true).fadeIn(200);
                        $("#layerStarGiftNew .gifts_popup .input_gifts[data-def]").val(function() {
                            return $(this).data("def");
                        });
                        $("#layerStarGiftNew .gifts_popup .gifts_info .gifts_number b").html($("#layerStarGiftNew .tab1 .send_area .userBalloonCount").html());
                        $("#layerStarGiftNew .gifts_popup .gifts_info .gifts_total .error").removeClass("on");
                        page.balloon.total();
                    }
                    return false;
                });

                //연속 선물 탭
                $("#layerStarGiftNew .gifts_popup .btn_tab").on("click", function() {
                    $(this).parent().find(".btn_tab.active").removeClass("active");
                    var getIdx = $(this).addClass("active").index();
                    $("#layerStarGiftNew .gifts_popup .gifts_panel").removeClass("active").eq(getIdx).addClass("active");
                    page.balloon.total();
                    return false;
                });
                $("#layerStarGiftNew .gifts_popup .btn_gifts_buy").on("click", function() {
                    $("#layerStarGiftNew .tab1 .send_area .btn_buy").trigger("click");
                    return false;
                });

                //연속 선물 팝업 닫기
                $("#layerStarGiftNew .gifts_popup .btn_gifts_close, #layerStarGiftNew .gifts_popup .btn_gifts_cancel").on("click", function() {
                    $("#layerStarGiftNew .gifts_popup").stop(true,true).fadeOut(200);
                    return false;
                });

                //입력창 선택
                var giftSelectInterval = null;
                $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_start, #layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_end, #layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_number, #layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_count").on("keyup focusout", function() {
                    page.balloon.total();
                }).on("focusin", function() {
                    var getInput = $(this);
                    clearTimeout(giftSelectInterval);
                    giftSelectInterval = setTimeout(function() {
                        getInput.select();
                    }, 100);
                });

                //연속 선물 하기
                var btnGiftCheck = true;
                $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .btn_gifts_gift").on("click", function() {
                    if(page.opt.giftcontinue !== true) return false;

                    //if(page.balloon.usecheck !== true && !page.isGrade("top", page.info.flag)) {
                    if(page.balloon.usecheck !== true) {
                        alert(page.balloon.usetime + "초 후 사용 가능합니다.");
                        return false;
                    }

                    if(btnGiftCheck === false) return false;
                    btnGiftCheck = false;
                    doTimeout("btn_gifts_gift", function() {
                        btnGiftCheck = true;
                    }, 1000);

                    page.balloon.use(true);

                    var giftTotal = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_info .gifts_total b").html();
                    if($("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_info .gifts_total .error").hasClass("on")) {
                        alert("보유한 별풍선이 부족합니다.");
                    }
                    else {
                        var giftEnd = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_end").val();
                        if(giftEnd === "" || giftEnd === undefined || giftEnd === null || isNaN(giftEnd)) {
                            giftEnd = 1;
                        }
                        if(+giftEnd < 10) {
                            alert("최소 10두산 이상부터 선물 가능합니다.");
                            $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_end").val(10);
                            page.balloon.total();
                        }
                        else if(confirm("총 " + giftTotal + " 개의 별풍선을 선물하시겠습니까?")) {
                            $("#layerStarGiftNew .gifts_popup").hide();
                            page.balloon.start("doosan");
                        }
                    }
                    return false;
                });
                $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .btn_gifts_gift").on("click", function() {
                    if(page.opt.giftcontinue !== true) return false;

                    //if(page.balloon.usecheck !== true && !page.isGrade("top", page.info.flag)) {
                    if(page.balloon.usecheck !== true) {
                        alert(page.balloon.usetime + "초 후 사용 가능합니다.");
                        return false;
                    }

                    if(btnGiftCheck === false) return false;
                    btnGiftCheck = false;
                    doTimeout("btn_gifts_gift", function() {
                        btnGiftCheck = true;
                    }, 1000);

                    page.balloon.use(true);

                    var giftTotal = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_info .gifts_total b").html();
                    if($("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_info .gifts_total .error").hasClass("on")) {
                        alert("보유한 별풍선이 부족합니다.");
                    }
                    else {
                        var giftNumber = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_number").val();
                        if(giftNumber === "" || giftNumber === undefined || giftNumber === null || isNaN(giftNumber)) {
                            giftNumber = 1;
                        }
                        if(+giftNumber < 10) {
                            alert("최소 10개 이상부터 선물 가능합니다.");
                            $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_number").val(10);
                            page.balloon.total();
                        }
                        else if(confirm("총 " + giftTotal + " 개의 별풍선을 선물하시겠습니까?")) {
                            $("#layerStarGiftNew .gifts_popup").hide();
                            page.balloon.start("continue");
                        }
                    }
                    return false;
                });

                //연속선물 취소
                $("#gifts_stats .btn_cancel, #gifts_stats .btn_close").on("click", function() {
                    clearInterval(page.balloon.interval);
                    clearTimeout(page.balloon.statsinterval);
                    $("#gifts_stats").fadeOut(200);
                    $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", false);
                    return false;
                });

                //선물창 닫기
                $(".player_item_list .star_balloon button").on("click", function() {
                    $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", false);
                    $("#layerStarGiftNew .tab1 .send_area .text_box .gift_box").val("");
                    $("#layerStarGiftNew .gifts_popup").hide();
                });

                //선물 채팅 메시지
                $("#layerStarGiftNew .tab1 .send_area .btn_area .btn_gift").on("click", function() {
                    var giftText = $("#layerStarGiftNew .tab1 .send_area .text_box .gift_box").val();
                    if($.trim(giftText) !== "") {
                        giftText = page.brtext(true, giftText);
                        giftText = page.brtext(false, giftText);
                        $("#layerStarGiftNew .tab1 .send_area .text_box .gift_box").val("");
                        $("#write_area").html(giftText);
                        doTimeout("gift_text_send", function() {
                            $("#btn_send").trigger("click");
                        }, 1000);
                    }
                });

                //임시
                //$("#layerStarGiftNew").fadeIn(200);
            }
        },
        total: function() {
            var getType = $("#layerStarGiftNew .gifts_popup .btn_tab.active").data("tab");
            var getTotal = 0;
            var getStats = 0;
            if(getType === "doosan") {
                var giftStart = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_start").val();
                var giftEnd = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_end").val();
                if(giftStart === "" || giftStart === undefined || giftStart === null || isNaN(giftStart)) {
                    giftStart = 1;
                    $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_start").val(1);
                }
                if(giftEnd === "" || giftEnd === undefined || giftEnd === null || +giftStart>+giftEnd) {
                    $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_end").val(giftStart);
                }
                getTotal = 0;
                for(var i = +giftStart ; i<= +giftEnd; i++) {
                    getTotal += i;
                }
                getStats = giftEnd;
            }
            else if(getType === "continue") {
                var giftNumber = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_number").val();
                var giftCount = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_count").val();
                if(giftNumber === "" || giftNumber === undefined || giftNumber === null || isNaN(giftNumber)) {
                    giftNumber = 1;
                    $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_number").val(1);
                }
                if(giftCount === "" || giftCount === undefined || giftCount === null) {
                    $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_count").val(1);
                }
                getTotal = +giftNumber * +giftCount;
                getStats = giftCount;
            }

            $("#layerStarGiftNew .gifts_popup .gifts_panel." + getType + " .gifts_info .gifts_total b").html(page.numberComma(getTotal));
            $("#layerStarGiftNew .gifts_popup .gifts_panel." + getType + " .gifts_info .gifts_total .error").removeClass("on");
            var getCurrentGift = $("#layerStarGiftNew .gifts_popup .gifts_info .gifts_number b").eq(0).text();
            getCurrentGift = getCurrentGift.replace(/,/gi,"");
            if(!isNaN(getCurrentGift) && +getCurrentGift < getTotal) {
                $("#layerStarGiftNew .gifts_popup .gifts_panel." + getType + " .gifts_info .gifts_total .error").addClass("on");
            }

            $("#gifts_stats p.on").removeClass("on");
            $("#gifts_stats p." + getType).addClass("on").find("b.total").html(page.numberComma(getStats));
        },
        start: function(type) {
            clearInterval(page.balloon.interval);
            var giftStart = 0;
            var giftEnd = 0;
            var giftNumber = 0;
            var giftCount = 0;
            var giftDelay = 0;
            var giftStartCheck = false;
            if(type === "doosan") {
                giftStart = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_start").val();
                giftEnd = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_end").val();
                giftDelay = $("#layerStarGiftNew .gifts_popup .gifts_panel.doosan .gifts_time").val();

                $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", true);
                if(giftStart !== "" && giftStart !== undefined && giftStart !== null && !isNaN(giftStart) && giftEnd !== "" && giftEnd !== undefined && giftEnd !== null && !isNaN(giftEnd)) {
                    if(isNaN(giftDelay) || +giftDelay < 200) giftDelay = 200;
                    clearTimeout(page.balloon.statsinterval);
                    $("#gifts_stats").fadeIn(200);
                    giftStart = +giftStart;
                    giftEnd = +giftEnd;
                    $("#gifts_stats p.doosan .count").html(0);
                    $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").val(giftStart);
                    page.balloon.interval = setInterval(function() {
                        if($("#gifts_stats").is(":visible") === false || giftStart > giftEnd) {
                            clearInterval(page.balloon.interval);
                            $("#gifts_stats").fadeOut(200);
                            page.balloon.use(false);
                            $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", false);
                            return;
                        }
                        else {
                            $("#gifts_stats p.doosan .count").html(giftStart);
                            $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").val(giftStart);
                            $("#layerStarGiftNew .tab1 .send_area .btn_area .btn_gift").trigger("click");
                            giftStart += 1;
                        }
                    }, giftDelay);
                    giftStartCheck = true;
                }
                else {
                    $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", false);
                }
            }
            else if(type === "continue") {
                giftNumber = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_number").val();     //개수
                giftCount = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_count").val();           //회수
                giftDelay = $("#layerStarGiftNew .gifts_popup .gifts_panel.continue .gifts_time").val();

                $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", true);
                if(giftNumber !== "" && giftNumber !== undefined && giftNumber !== null && !isNaN(giftNumber) && giftCount !== "" && giftCount !== undefined && giftCount !== null && !isNaN(giftCount)) {
                    if(isNaN(giftDelay) || +giftDelay < 200) giftDelay = 200;
                    clearTimeout(page.balloon.statsinterval);
                    $("#gifts_stats").fadeIn(200);
                    giftNumber = +giftNumber;
                    giftCount = +giftCount;
                    giftStart = 1;
                    $("#gifts_stats p.continue .count").html(0);
                    $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").val(giftNumber);
                    page.balloon.interval = setInterval(function() {
                        if($("#gifts_stats").is(":visible") === false || giftStart > giftCount) {
                            clearInterval(page.balloon.interval);
                            $("#gifts_stats").fadeOut(200);
                            page.balloon.use(false);
                            $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", false);
                            return;
                        }
                        else {
                            $("#gifts_stats p.continue .count").html(giftStart);
                            $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").val(giftNumber);
                            $("#layerStarGiftNew .tab1 .send_area .btn_area .btn_gift").trigger("click");
                            giftStart += 1;
                        }
                    }, giftDelay);
                    giftStartCheck = true;
                }
                else {
                    $("#layerStarGiftNew .tab1 .send_area .gift_at .starCount").prop("readonly", false);
                }
            }

            if(giftStartCheck === true) {
                page.balloon.use(false);
            }
        },
        use: function(type) {
            clearInterval(page.balloon.useinterval);
            if(type === false) {
                page.balloon.usecheck = false;
                page.balloon.usetime = 30;
                page.balloon.useinterval = setInterval(function() {
                    page.balloon.usetime -= 1;
                    if(page.balloon.usetime < 1) {
                        page.balloon.use(true);
                    }
                }, 1000);
            }
            else {
                page.balloon.usetime = 0;
                page.balloon.usecheck = true;
            }
        }
    },


    //유틸
    alarm: function() {
        if($("#chat_alarm").length > 0) $("#chat_alarm").remove();
        $("body").append('<div id="chat_alarm"><embed hidden="true" autostart="true" loop="false" src="https://mngr.afreehp.kr/mngr/sound.mp3" /></div>');
    },

    brtext: function(type, msg) {
        if(typeof msg == "string" && $.trim(msg) !== "") {
            if(type) {
                msg = msg.replace(/\r\n/g,"<br>").replace(/\n/g,"<br>").replace(/\r/g,"<br>");
            }
            else {
                //preg_replace('#(<br */?>\s*)+#i', '<br />', $html);
                //msg = msg.replace(/(<br\s*\/?>\s*)+/gi,"<br>").replace(/<br>/g,"\r\n");
                msg = msg.replace(/(<br[^>]*>\s*){3,}/gi,"<br>").replace(/<br>/g,"\r\n");
            }
        }
        return msg;
    },

    //대체어
    replacedetail: function(data, msg) {
        var getMsg = msg;
        var getName = "";
        if(data.name != undefined && data.name !== "") {
            getMsg = getMsg.replace(/{닉네임}/gi, data.name);
            getName = data.name;
        }
        if(data.id != undefined && data.id !== "") {
            getMsg = getMsg.replace(/{아이디}/gi, data.id);
            if(getName !== "") {
                getName = getName + "(" + data.id + ")";
            }
            else getName = data.id;
        }
        if(data.join != undefined && data.join !== "") {
            getMsg = getMsg.replace(/{가입수}/gi, page.numberComma(data.join));
        }
        if(data.val != undefined && data.val !== "") {
            getMsg = getMsg.replace(/{선물수}/gi, page.numberComma(data.val));
        }
        if(data.follow != undefined && data.follow !== "") {
            getMsg = getMsg.replace(/{개월수}/gi, page.numberComma(data.follow));
        }
        if(getMsg.indexOf("{이름}") > -1 && getName !== "") {
            getMsg = getMsg.replace(/{이름}/gi, getName);
        }

        if(data.uplist != undefined && data.uplist.length > 0) {
            getMsg = getMsg.replace(/{최근추천}/gi, data.uplist.join(","));
        }
        if(data.up != undefined && data.up > 0) {
            getMsg = getMsg.replace(/{오늘추천수}/gi, data.up);
        }
        return getMsg;
    },
    replaceword: function(type, msg) {
        var getMsg = msg;
        if(getMsg.indexOf("{제목}") > -1 && page.info.detail.title != undefined) {
            getMsg = getMsg.replace(/{제목}/gi, page.info.detail.title);
        }
        if(getMsg.indexOf("{시작시간}") > -1 && page.info.detail.start != undefined) {
            getMsg = getMsg.replace(/{시작시간}/gi, page.info.detail.start);
        }
        if(getMsg.indexOf("{시청자수}") > -1 && page.info.detail.view != undefined) {
            getMsg = getMsg.replace(/{시청자수}/gi, page.numberComma(page.info.detail.view));
        }
        if(getMsg.indexOf("{누적시청자수}") > -1 && page.info.detail.total != undefined) {
            getMsg = getMsg.replace(/{누적시청자수}/gi, page.numberComma(page.info.detail.total));
        }
        if(getMsg.indexOf("{팬클럽수}") > -1 && page.info.detail.fan != undefined) {
            getMsg = getMsg.replace(/{팬클럽수}/gi, page.numberComma(page.info.detail.fan));
        }
        if(getMsg.indexOf("{서포터수}") > -1 && page.info.detail.sup != undefined) {
            getMsg = getMsg.replace(/{서포터수}/gi, page.numberComma(page.info.detail.sup));
        }
        if(getMsg.indexOf("{구독자수}") > -1 && page.info.detail.follow != undefined) {
            getMsg = getMsg.replace(/{구독자수}/gi, page.numberComma(page.info.detail.follow));
        }
        if((getMsg.indexOf("{즐찾수}") > -1 || getMsg.indexOf("{즐겨찾기수}") > -1) && page.info.detail.fav != undefined) {
            getMsg = getMsg.replace(/{즐찾수}/gi, page.numberComma(page.info.detail.fav));
            getMsg = getMsg.replace(/{즐겨찾기수}/gi, page.numberComma(page.info.detail.fav));
        }
        if(getMsg.indexOf("{추천수}") > -1 && page.info.detail.up != undefined) {
            getMsg = getMsg.replace(/{추천수}/gi, page.numberComma(page.info.detail.up));
        }

        if(getMsg.indexOf("{오늘추천수}") > -1 && page.info.up.today != undefined) {
            getMsg = getMsg.replace(/{오늘추천수}/gi, page.numberComma(page.info.up.today));
        }
        if(getMsg.indexOf("{최근추천}") > -1 && page.info.up.today > 0 && page.info.up.recent.length > 0) {
            getMsg = getMsg.replace(/{최근추천}/gi, page.info.up.recent.join(","));
        }

        if(getMsg.indexOf("{방송시간}") > -1 && page.info.detail.start != undefined) {
            var getStartDate = new Date(page.info.detail.start);
            var getCurrentDate = new Date();
            var getUptime = (getCurrentDate - getStartDate) / 1000;

            var getUptimeDay = Math.floor(getUptime/86400);
            var getUptimeHour = Math.floor((getUptime%86400)/3600);
            var getUptimeMin = Math.floor(((getUptime%86400)%3600)/60);
            var getUptimeSec = Math.floor((getUptime%86400)%3600)%60;

            var getUptimeStr = [];
            if(getUptimeDay > 0) {
                getUptimeStr.push((getUptimeDay < 10 ? "0" : "") + getUptimeDay + "일");
            }
            if(getUptimeHour > 0) {
                getUptimeStr.push((getUptimeHour < 10 ? "0" : "") + getUptimeHour + "시간");
            }
            if(getUptimeMin > 0) {
                getUptimeStr.push((getUptimeMin < 10 ? "0" : "") + getUptimeMin + "분");
            }
            if(getUptimeSec > 0) {
                getUptimeStr.push((getUptimeSec < 10 ? "0" : "") + getUptimeSec + "초");
            }

            getMsg = getMsg.replace(/{방송시간}/gi, getUptimeStr.join(" "));
        }
        if(getMsg.indexOf("{시간}") > -1) {
            getMsg = getMsg.replace(/{시간}/gi, page.timeFormat("시간"));
        }
        if(getMsg.indexOf("{날짜}") > -1) {
            getMsg = getMsg.replace(/{날짜}/gi, page.timeFormat("날짜"));
        }
        if(getMsg.indexOf("{time}") > -1) {
            getMsg = getMsg.replace(/{time}/gi, page.timeFormat("time"));
        }
        if(getMsg.indexOf("{day}") > -1) {
            getMsg = getMsg.replace(/{day}/gi, page.timeFormat("day"));
        }
        if(getMsg.indexOf("{요일}") > -1) {
            getMsg = getMsg.replace(/{요일}/gi, page.timeFormat("요일"));
        }
        if(getMsg.indexOf("{명령어}") > -1) {
            var commandList = [];
            $.each(page.data.autolist, function(keys, values) {
                if(values[0] === true && values[1] !== "" && values[2] !== "") {
                    commandList.push(values[1]);
                }
            });
            getMsg = getMsg.replace(/{명령어}/gi, commandList.join(" "));
        }

        if(getMsg.indexOf("{갈고리시간}") > -1) {
            getMsg = getMsg.replace(/{갈고리시간}/gi, page.timestrconvert(page.galgori.data.time));
        }
        if(getMsg.indexOf("{갈고리개수}") > -1) {
            getMsg = getMsg.replace(/{갈고리개수}/gi, page.galgori.data.count);
        }
        if(getMsg.indexOf("{최대갈고리개수}") > -1) {
            getMsg = getMsg.replace(/{최대갈고리개수}/gi, page.galgori.data.maxcount);
        }
        if(getMsg.indexOf("{최대갈고리아이디}") > -1) {
            getMsg = getMsg.replace(/{최대갈고리아이디}/gi, page.galgori.data.maxid);
        }
        if(getMsg.indexOf("{최대갈고리이름}") > -1) {
            getMsg = getMsg.replace(/{최대갈고리이름}/gi, page.galgori.data.maxname);
        }
        if(getMsg.indexOf("{최대갈고리닉네임}") > -1) {
            getMsg = getMsg.replace(/{최대갈고리닉네임}/gi, page.galgori.data.maxname);
        }

        if(getMsg.indexOf("갈고리") > -1) {
            doTimeout("replaceword_galgori", function() {
                log("galgori",{ type:"galgori", bjid:page.info.bjid, id:page.info.id, msg:getMsg });
            }, 1000);
        }

        return getMsg;
    },

    timestrconvert: function(date) {
        var getTimeSec = parseInt((new Date().getTime() / 1000) - (date / 1000), 10);

        var getStr = date;
        if(getTimeSec < 60) {
            getStr = getTimeSec + "초";
        }
        else if(getTimeSec >= 60 && getTimeSec < 3600) {
            getStr = Math.floor(getTimeSec/60) + "분";
        }
        else if(getTimeSec >= 3600 && getTimeSec < 86400) {
            getStr = Math.floor(getTimeSec/3600) + "시간";
        }
        else if(getTimeSec >= 86400 && getTimeSec < 2419200) {
            getStr = Math.floor(getTimeSec/86400) + "일";
        }
        return getStr;
    },

    getFlag: function() {
        var getFlag = 0;
        if(liveView.ChatInfo.myUserInfo && liveView.ChatInfo.myUserInfo.nFlag1) {
            return liveView.ChatInfo.myUserInfo.nFlag1;
        }
        return getFlag;
    },
    isLogin: function() {
        return liveView.isLogin();
    },
    isUse: function() {
        return $("#add_menu_check").is(":checked");
    },
    isAdmin: function(grade) {
        if(page.debug === true) return false;
        return grade == "mng" || grade == "bj";
    },
    isManager: function() {
        var getResult = false;

        if(page.isLogin()) {
            var getGrade = "";
            if(page.info.flag !== "" && page.info.flag > 0) {
                getGrade = page.grade("grade", page.info.flag);
            }
            else {
                if(liveView.ChatInfo.myUserInfo && liveView.ChatInfo.myUserInfo.bManager) {
                    return true;
                }
            }
            if(isAdmin || getGrade == "mng" || getGrade == "bj") {
                getResult = true;
            }
        }
        return getResult;
    },
    isMe: function(id) {
        if(isAdmin !== true && (id == undefined || id == null || id === "")) return false;
        return page.getid(id) == page.info.id;
    },
    isGrade: function(type, grade) {
        var getGrade = page.grade("grade", grade);
        var getFollow = page.grade("follow", grade);
        var getSupport = page.grade("support", grade);

        var getCheck = false;
        if(type == "fansupfollow") {
            if(getGrade != "non") {
                getCheck = true;
            }
        }
        else if(type == "fansup") {
            if(getGrade == "non" || getFollow === true) {
            }
            else {
                getCheck = true;
            }
        }
        else if(type == "mng") {
            if(getGrade == "bj" || getGrade == "mng") {
                getCheck = true;
            }
        }
        else if(type == "top") {
            if(getGrade == "bj" || getGrade == "mng" || getGrade == "top") {
                getCheck = true;
            }
        }
        else if(type == "fan") {
            if(getGrade == "bj" || getGrade == "mng" || getGrade == "top" || getGrade == "fan") {
                getCheck = true;
            }
        }
        else if(type == "sup") {
            if(getSupport === true) {
                getCheck = true;
            }
        }
        else if(type == "follow") {
            if(getFollow === true) {
                getCheck = true;
            }
        }
        else if(type == "non") {
            if(getGrade == "non") {
                getCheck = true;
            }
        }
        return getCheck;
    },
    isBelow: function(type, grade) {
        var getGrade = page.grade("grade", grade);
        var getFollow = page.grade("follow", grade);
        var getSupport = page.grade("support", grade);

        var getCheck = false;
        if(type == "non") {
            if(getGrade == "non") {
                getCheck = true;
            }
        }
        else if(type == "sup") {
            if(getGrade == "non" || getSupport === true) {
                getCheck = true;
            }
        }
        else if(type == "follow") {
            if(getGrade == "non" || getFollow === true) {
                getCheck = true;
            }
        }
        else if(type == "fan") {
            if(getGrade == "bj" || getGrade == "mng" || getGrade == "top") {
            }
            else {
                getCheck = true;
            }
        }
        else if(type == "top") {
            if(getGrade == "bj" || getGrade == "mng") {
            }
            else {
                getCheck = true;
            }
        }

        return getCheck;
    },
    isSocket: function() {
        return page.socket != null && page.socket.connected === true;
    },
    getid: function(id) {
        if(id == undefined || id == null || id === "") return "";
        var getId = id.match(/(\w+)(\(\d\))?/);
        return getId ? getId[1] : id
    },
    grade: function(type, grade) {
        if(type == "grade") {
            if(page.compareFlag(grade, liveView.ChatInfo.userFlag.bj)) return "bj";
            else if(page.compareFlag(grade, liveView.ChatInfo.userFlag.manager)) return "mng";
            else if(page.compareFlag(grade, liveView.ChatInfo.userFlag.topfan)) return "top";
            else if(page.compareFlag(grade, liveView.ChatInfo.userFlag.fan)) return "fan";
            else return "non";
        }
        else if(type == "support") {
            return page.compareFlag(grade, liveView.ChatInfo.userFlag.supporter);
        }
        else if(type == "follow") {
            return page.compareFlag(grade, liveView.ChatInfo.userFlag.follower);
        }
        else if(type == "sex") {
            return page.compareFlag(grade, liveView.ChatInfo.userFlag.female) ? "w" : "m";
        }
        else if(type == "quick") {
            return page.compareFlag(grade, liveView.ChatInfo.userFlag.quickview);
        }
        else if(type == "mobile") {
            return page.compareFlag(grade, liveView.ChatInfo.userFlag.mobile);
        }
    },
    compareFlag: function(level, chkFlag) {
        return ((level & chkFlag) > 0) ? true : false;
    },
    randomRange: function(n1, n2) {
        return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
    },
    numberComma: function(val) {
        var parts = val.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    },
    timeWeek: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    timeFormat: function(type) {
        var getVal = "";
        var getNow = new Date();
        if(type == "시간") {
            getVal = ((getNow.getHours() < 10)?"0":"") + getNow.getHours() +"시 "+ ((getNow.getMinutes() < 10)?"0":"") + getNow.getMinutes() + "분";
        }
        else if(type == "날짜") {
            getVal = (((getNow.getMonth() + 1) < 10)?"0":"") + (getNow.getMonth() + 1) + "월 " + ((getNow.getDate() < 10)?"0":"") + getNow.getDate() + "일";
        }
        if(type == "time") {
            getVal = ((getNow.getHours() < 10)?"0":"") + getNow.getHours() +":"+ ((getNow.getMinutes() < 10)?"0":"") + getNow.getMinutes();
        }
        else if(type == "day") {
            getVal = (((getNow.getMonth() + 1) < 10)?"0":"") + (getNow.getMonth() + 1) + "-" + ((getNow.getDate() < 10)?"0":"") + getNow.getDate();
        }
        else if(type == "요일") {
            var getDay = getNow.getDay();
            getVal = page.timeWeek[getDay];
        }
        else if(type == "date") {
            getVal = getNow.getFullYear() + (((getNow.getMonth() + 1) < 10)?"0":"") + (getNow.getMonth() + 1) + ((getNow.getDate() < 10)?"0":"") + getNow.getDate();
        }
        return getVal;
    },
    getCookie: function(cname) {
        var name = cname + "=";
        //var decodedCookie = decodeURIComponent(document.cookie);
        var decodedCookie = document.cookie;
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    setCookie: function(cname, cvalue, cpath, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

function doTimeout(name, func, timeout) {
    var getDoName = "do_" + name;
    if(typeof window[getDoName] !== "undefined") {
        clearTimeout(window[getDoName]);
    }
    if(typeof func === "function") {
        window[getDoName] = setTimeout(func,timeout);
    }
}

$(function() {
    if(isAdmin === true) {
        page.log.debug = true;
    }

    page.init();

    page.mngrcheck();

});

var isAdmin = false;

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    if(lineNumber == 0 || lineNumber.toString() == "0" || lineNumber == 1 || lineNumber.toString() == "1") return;
    $.ajax({
        type:"POST",
        url:"https://"+serverUrl+"/mngr/log.php",
        data:{
            type:"error",
            log:JSON.stringify({ line:lineNumber, error:errorMsg, url:url, info:page.info })
        }
    });
    return true;
}
function log(type, data) {
    $.ajax({
        type:"POST",
        url:"https://"+serverUrl+"/mngr/log.php",
        data:{
            type:type,
            log:JSON.stringify(data)
        }
    });
}
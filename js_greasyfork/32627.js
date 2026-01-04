// ==UserScript==
// @name         Naver Cafe Blacklist Userscript
// @namespace    BossLeader
// @version      1.1.4
// @require
// @description  Naver Cafe Hide blacklist
// @author       BossLeader
// @match        http://cafe.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32627/Naver%20Cafe%20Blacklist%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/32627/Naver%20Cafe%20Blacklist%20Userscript.meta.js
// ==/UserScript==


function ui2(e, p_memberid, lv_open_type, p_nickname, p_clubid, p_memberinfo, p_entireBoardStaff, p_memberleveluse, p_cluburl, p_activityStopExecutable, p_menuid, sMode) {
    e = e || window.event;
    var sType = ""
    , elIFrame = self.frameElement;
    var ajax = new Ajax("/CafeMemberExistCheck.nhn",{
        method: "POST",
        params: {
            clubid: p_clubid,
            memberid: p_memberid
        },
        onLoad: onCafeMemberCheckAjaxLoad
    });
    if (!ui_sBeforeID) {
        ui_sBeforeID = "menu_parent";
    }
    sNewID = "elFloatLayer_" + Math.floor(Math.random() * 100000);
    if (uiFactory == null) {
        uiFactory = new uiFactoryObject2();
    }
    sType = "loadingBar";
    if (elIFrame) {
        var nPosTop = Element.realPos(Event.ready(e).element).top
        , nFrameHeight = document.documentElement.offsetHeight
        , nDiff = (nPosTop + _nUIMaxHeight) - nFrameHeight
        , nNewHeight = nFrameHeight + nDiff;
        if (nNewHeight > nFrameHeight) {
            elIFrame.style.height = nNewHeight + "px";
        }
    }
    uiFactory.createUi(ui_sBeforeID, sNewID, sType);
    ui_sBeforeID = sNewID;
    var bApplyMember = false;
    var bSecedeMember = false;
    var bActivityStop = false;
    function onCafeMemberCheckAjaxLoad() {
        try {
            var oJsonData = eval("(" + arguments[0].responseText + ")");
            if (oJsonData.exist != "true") {
                bSecedeMember = true;
            }
            if (oJsonData.apply == "true") {
                bApplyMember = true;
            }
            if (oJsonData.activityStop == "true") {
                bActivityStop = true;
            }
            sType = "menu";
            uiFactory.setParameter(p_memberid, lv_open_type, p_nickname, p_clubid, p_memberinfo, p_memberleveluse, p_cluburl, p_menuid);
            var htParam = {
                p_memberid: p_memberid,
                lv_open_type: lv_open_type,
                p_nickname: p_nickname,
                p_clubid: p_clubid,
                p_memberinfo: p_memberinfo,
                p_entireBoardStaff: p_entireBoardStaff,
                p_memberleveluse: p_memberleveluse,
                p_cluburl: p_cluburl,
                p_activityStopExecutable: p_activityStopExecutable,
                bApplyMember: bApplyMember,
                bSecedeMember: bSecedeMember,
                bActivityStop: bActivityStop
            };
            if (elIFrame) {
                htParam.fAfterCreate = function() {
                    nFrameHeight = document.documentElement.offsetHeight;
                    var cafe_main_IframeHeight = parseInt(top.$("cafe_main").style.height);
                    if (nNewHeight > nFrameHeight) {
                        newCafeMainIframeHeight = (cafe_main_IframeHeight + (nNewHeight - nFrameHeight)) + "px";
                        elIFrame.style.height = nNewHeight + "px";
                        top.$("cafe_main").style.height = newCafeMainIframeHeight;
                    }
                }
                ;
            }
            uiFactory.createUi(ui_sBeforeID, sNewID, sType, htParam);
        } catch (e) {}
    }
    if (sMode == "WIDGET") {
        var nDiffTop = $("lm-list").scrollTop;
        var nHeightElement = Event && Event.ready ? Event.ready(e).element.offsetHeight : 13;
        nDiffTop = -(nDiffTop == 0 ? 0 : nDiffTop - nHeightElement);
        oCL.show(sNewID, e, nDiffTop);
    } else {
        if(top.$("cafe_main").__show && top.$("cafe_main").__show == true)
        oCL.show(sNewID, e);
    }
}
function uiFactoryObject2() {
    var a;
    this.setParameter = function(f, k, g, c, h, e, b, d) {
        ui_memberid = f;
        if (k == null) {
            ui_open_type = "3";
        }
        ui_open_type = k.toString();
        if (g == null) {
            ui_nickname = "";
        } else {
            ui_nickname = g;
        }
        if (d != null) {
            ui_menuid = d;
        }
        ui_clubid = c;
        ui_memberinfo = h;
        ui_memberleveluse = e;
        ui_cluburl = b;
    };
    this.createUi = function(f, h, b, c) {
        if (!document.getElementById(f)) {
            var e = document.createElement("DIV");
            e.id = "menu_parent";
            e.style.display = "block";
            e.style.position = "absolute";
            e.className = "perid-layer";
            document.body.appendChild(e);
        }
        var k = document.getElementById(f);
        k.id = h;
        k.innerHTML = "";
        if (b == "loadingBar") {
            k.style.width = "109px";
            var l = document.createElement("dl");
            l.className = "nm_load";
            var g = document.createElement("dt");
            g.innerHTML = sLoadBarTmpl;
            l.appendChild(g);
            var d = document.createElement("dd");
            d.innerHTML = "정보를 불러오는<br>중입니다";
            l.appendChild(d);
            k.appendChild(l);
        } else {
            if (b == "menu") {
                k.style.width = "209px";
                k.innerHTML = "";
                var m = document.createElement("UL");
                m.appendChild(this.createFragment(c));
                k.appendChild(m);
                if (typeof c.fAfterCreate == "function") {
                    c.fAfterCreate();
                }
            }
        }
    };
    this.createFragment = function(g) {
        var f = this.setUiArr(g);
        var d;
        d = document.createDocumentFragment();
        var b = false;
        for (var c = 0, e = f.length; c < e; c++) {
            if (f[c] == "|" && c + 1 < e) {
                b = true;
            } else {
                d.appendChild(this.setMenuItem(f[c], b, g));
                b = false;
            }
        }
function AddBlackList(){
    uiFactory.hideUi();
    var blockedID = window.localStorage.getItem("blockedID").split(',');
    var blockedName = window.localStorage.getItem("blockedName").split(',');
    var i;
    for (i = 0; i < blockedID.length; i++) {
        if (blockedID[i] == '') {blockedID[i] = g.p_memberid; blockedName[i] = g.p_nickname; alert('추가됨 '+blockedID.length); break; }
        if (blockedID[i] == g.p_memberid) {alert('이미 차단된 사용자입니다.'); break;}
    }
    if (i >= blockedID.length) {
        blockedID[i] = g.p_memberid;
        blockedName[i] = g.p_nickname;
        alert('추가됨 '+blockedID.length);
    }
    window.localStorage.setItem("blockedID", blockedID);
    window.localStorage.setItem("blockedName", blockedName);
    top.$('cafe_main').SetBFilter();
    return false;
}
function GoogleSearch(s) {
    uiFactory.hideUi();
    window.open(encodeURI('http://www.google.com/search?q='+s));
    return false;
}
        d.appendChild(this.setMenuItem2('#차단하기#', true, AddBlackList));
        d.appendChild(this.setMenuItem2(g.p_nickname, true, function(){ GoogleSearch(g.p_nickname); } ));
        d.appendChild(this.setMenuItem2(g.p_memberid, false, function(){ GoogleSearch(g.p_memberid); } ));
        d.appendChild(this.setMenuItem2('comment - not yet', true));
        //d.appendChild(this.setMenuItem2('lv: '+g.lv_open_type, false, g));
        //d.appendChild(this.setMenuItem2('clubid: '+g.p_clubid, false, g));
        //d.appendChild(this.setMenuItem2('memberinfo: '+g.p_memberinfo, false, g));
        //d.appendChild(this.setMenuItem2('entireBoardStaff: '+g.p_entireBoardStaff, false, g));
        //d.appendChild(this.setMenuItem2('memberleveluse: '+g.p_memberleveluse, false, g));
        //d.appendChild(this.setMenuItem2('cluburl:  '+g.p_cluburl, false, g));
        //d.appendChild(this.setMenuItem2('activityStopExecutable: '+g.p_activityStopExecutable, false, g));
        //d.appendChild(this.setMenuItem2('bApplyMember: '+g.bApplyMember, false, g));
        //d.appendChild(this.setMenuItem2('bSecedeMember: '+g.bSecedeMember, false, g));
        //d.appendChild(this.setMenuItem2('bActivityStop: '+g.bActivityStop, false, g));
        return d;
    };
    this.setUiArr = function(c) {
        var b = [];
        if (c.p_memberinfo == "me" || c.p_memberinfo == "st" || c.p_memberinfo == "ma") {
            if (c.bApplyMember) {
                b.push("inviteCafe");
                b.push("sendMemo");
                b.push("viewBlog");
                return b;
            }
            if (c.bSecedeMember) {
                if (c.p_memberinfo == "ma" || c.p_entireBoardStaff == "true") {
                    b.push("viewArticle");
                    return b;
                }
            } else {
                b.push("viewArticle");
                if (c.p_memberid != g_sUserId) {
                    b.push("inviteCafeChat");
                    b.push("sendMemo");
                }
            }
        }
        b.push("|");
        if (c.p_memberid != g_sUserId) {
            if (c.p_memberinfo == "st" || c.p_memberinfo == "ma") {
                if (c.p_memberleveluse == "true") {
                    b.push("updateLevel");
                }
                if (c.p_activityStopExecutable == "true") {
                    if (c.bActivityStop == false) {
                        b.push("activityStop");
                    } else {
                        b.push("activityStopRelease");
                    }
                }
                b.push("kickMember");
                b.push("|");
            } else {
                if (c.p_activityStopExecutable == "true") {
                    if (c.bActivityStop == false) {
                        b.push("activityStop");
                    } else {
                        b.push("activityStopRelease");
                    }
                    b.push("|");
                }
            }
        }
        if (c.p_memberid != g_sUserId) {
            b.push("subscribeNaverMe");
        }
        b.push("inviteCafe");
        b.push("|");
        b.push("viewBlog");
        return b;
    };
    this.setMenuItem = function(c, f, g) {
        var b;
        b = document.createElement("Li");
        if (f) {
            b.className = "line";
        }
        var d = document.createElement("A");
        d.href = "#";
        d.onclick = function() {
            execMenuItem(c, g.p_memberid, g.p_membernick);
            return false;
        };
        var e = document.createElement("SPAN");
        e.innerHTML = uiMenuArr[c];
        d.appendChild(e);
        b.appendChild(d);
        return b;
    };
    this.setMenuItem2 = function(text, line, func) {
        var ret;
        ret = document.createElement("Li");
        if (line) {
            ret.className = "line";
        }
        var atag = document.createElement("A");
        atag.href = "#";
        if(func != undefined) atag.onclick = func;
        var e = document.createElement("SPAN");
        e.innerHTML = text;
        atag.appendChild(e);
        ret.appendChild(atag);
        return ret;
    };
    this.hideUi = function() {
        oCL.hide(ui_sBeforeID);
    };
}
function Ready(){
    $("front-img").innerHTML = 'Iframe is loaded.';
    var x = $('cafe_main');
    var y = (x.contentWindow || x.contentDocument);
    if (y.document) y = y.document;
    x.__show = false;
    x.SetBFilter = function() {SetBFilter(); };
    
    var articlelist = y.querySelector('form > .board-box > tbody');
    var ListInfo = [];
    if (articlelist)  {
        for (i = 0; i < articlelist.childElementCount; i++) {
            var p_memberid, p_nickname, p_title, p_href, articlelistindex;
            var nicka = articlelist.children[i].querySelector('.p-nick a');
            if (nicka == null) continue;
            var str = nicka.getAttribute("onclick").split(',');
            p_memberid = str[1].trim().replace(/\'|\"/g,'');
            p_nickname = str[3].trim().replace(/\'|\"/g,'');
            p_title = articlelist.children[i].querySelector('span.aaa a').text;
            p_href = articlelist.children[i].querySelector('span.aaa a').href;
            articlelistindex = i;
            ListInfo[ListInfo.length] =  {
                p_memberid: p_memberid,
                p_nickname: p_nickname,
                p_title: p_title,
                p_href: p_href,
                articlelistindex: articlelistindex
            };
        }
    }

    function shownhide(num, nFilterState) { // 0: showall 1: black 2: hide
        if(!articlelist) return;
        if (nFilterState == 1) {
            articlelist.children[num].style = 'background-color:#505050;';
            //articlelist.children[num+1].style = '';
        } else if (nFilterState == 2) {
            articlelist.children[num].style = 'display: none;';
            //articlelist.children[num+1].style = 'display: none;';
        } else {
            articlelist.children[num].style = '';
            //articlelist.children[num+1].style = '';
        }
    }

    //alert(ListInfo.length + ' ' + ListInfo[1].p_memberid);
    function SetBFilter() {
        if(!articlelist) return;
        function BFilter() {
            var blockedID = storage.getItem("blockedID").split(",");
            var blockedName = storage.getItem("blockedName").split(",");
            var nFilterState = Number(storage.getItem("nFilterState"));
            if (blockedID[0] === null || blockedID[0] === '') {
                //alert('BlockedUsers : 0');
                for (i = 0; i < ListInfo.length; i++) {
                    shownhide(ListInfo[i].articlelistindex, 0);// 0: showall 1: black 2: hide
                }
                ToggleFilter.text = '필터 OFF...';
                return;
            }
            var cnt = 0;
            for (i = 0; i < ListInfo.length; i++) {
                if (blockedID.indexOf(ListInfo[i].p_memberid) == -1) {
                    shownhide(ListInfo[i].articlelistindex, 0);
                } else {
                    //founded
                    shownhide(ListInfo[i].articlelistindex, nFilterState);// 0: showall 1: black 2: hide
                    cnt++;
                }
            }
            if (nFilterState == 0) {
                ToggleFilter.text = '필터 OFF...';
            } else {
                ToggleFilter.text = '필터'+nFilterState+' ON (차단: '+cnt+')';
            }
        };
        BFilter();
        var nMemberViewState = Number(storage.getItem("nMemberViewState"));
        if (nMemberViewState == 0) {
            for (i = 0; i < ListInfo.length; i++) {
                var e = articlelist.children[ListInfo[i].articlelistindex].querySelector('span.aaa select');
                if (e) {
                    articlelist.children[ListInfo[i].articlelistindex].querySelector('span.aaa a').style = '';
                    articlelist.children[ListInfo[i].articlelistindex].querySelector('span.aaa').removeChild(e);
                }
            }
            return;
        }
        var packedList = [];
        var packedListIndex = [];
        for (i = 0; i < ListInfo.length; i++) {
            var idx = packedList.indexOf(ListInfo[i].p_memberid);
            if (idx == -1) {
                packedList[packedList.length] = ListInfo[i].p_memberid;
                packedListIndex[packedListIndex.length] = i;
            } else {//p_memberid = packedList[idx], ListInfo_i = packedListIndex[idx]    ListInfo[packedListIndex[idx]].articlelistindex
                var paaa = articlelist.children[ListInfo[packedListIndex[idx]].articlelistindex].querySelector('span.aaa');
                var e = paaa.querySelector('select');
                if (!e) {
                    paaa.querySelector('a').style = 'display: none;';

                    e = document.createElement("select");
                    e.style = 'width: 300px; ';
                    e.onchange = function () {
                        var chosenoption = this.options[this.selectedIndex];
                        if (chosenoption.value != "none") {
                            window.open(chosenoption.value, "cafe_main", "");
                        }
                    };

                    var op1 = document.createElement("option");
                    op1.text = "---select---";
                    op1.setAttribute('value', 'none');
                    e.add(op1);
                    op1 = document.createElement("option");
                    op1.text = paaa.querySelector('a').text;
                    op1.setAttribute('value', paaa.querySelector('a').href);
                    e.add(op1);

                    paaa.insertBefore(e, paaa.childNodes[0]);
                }
                var saaa = articlelist.children[ListInfo[i].articlelistindex].querySelector('span.aaa');
                var op1 = document.createElement("option");
                op1.text = saaa.querySelector('a').text;
                op1.setAttribute('value', saaa.querySelector('a').href);
                e.add(op1);

                shownhide(ListInfo[i].articlelistindex, 2);
            }
        }
    }


    var z = y.querySelectorAll('.p-nick a');
    var pop = false;
    for (i = 0; i < z.length; i++) {
         // if(z[i].getAttribute("onclick") == null) {dsfsdf();}
        var str = (z[i]?(z[i].getAttribute("onclick")?z[i].getAttribute("onclick").replace('ui(','ui2('):''):'');
        //z[i].getAttribute("onclick").replace('ui(','ui2(') ;
        if (str == '') pop = true;
        z[i].setAttribute('onclick',ui2.toString()+uiFactoryObject2.toString()+str);
    }
    if (pop && z[0] && z[0].getAttribute("onclick") ) { z[0].click(); }
    
        //alert(z[0].getAttribute("onclick"));

    function toBool(a) { return ("false" === a) ? false : true; }

    var storage = window.localStorage;
    CheckUserData(storage);

    var ShowBlackList, ResetBlackList, ToggleFilter, btnMemberView;
    //헤드에 AddButton
    var head = y.querySelector('.fr');
    if (head){
        var line = head.querySelector('span.fl');
        if (line) {
            function addButton(str, id){
                //구분자.
                var fl = line.cloneNode(true);
                head.insertBefore(fl, head.childNodes[0]);
                //버튼1 - Show BlackList
                if (id == '') return;
                var d = document.createElement('div');
                d.setAttribute('id',id);
                d.style = 'float: left; margin-top: 3px; margin-right: 5px;';
                var sa = document.createElement("a");
                sa.setAttribute('href','#');
                var t = document.createTextNode(str);
                sa.appendChild(t);
                d.appendChild(sa);
                head.insertBefore(d, head.childNodes[0]);
                return sa;
            }
            ShowBlackList = addButton('차단목록 보기', 'ShowBlackList');
            ShowBlackList.onclick  = function() {
                var blockedID = storage.getItem("blockedID").split(",");
                var blockedName = storage.getItem("blockedName").split(",");
                if (blockedID[0] === null || blockedID[0] === '') {
                    alert('BlockedUsers : 0'); return false;
                }
                var str = 'BlockedUsers : '+blockedID.length+'\r';
                for (i = 0; i < blockedID.length; i++) {
                    str = str + blockedName[i] + '/' + blockedID[i] + '\r';
                }
                alert(str); return false;
            };
            ResetBlackList = addButton('목록 초기화', 'ResetBlackList');
            ResetBlackList.onclick = function() {
                var txt;
                var r = confirm("차단 목록을 삭제합니다! \r삭제된 목록은 복구할 수 없습니다!");
                if (r == true) {
                    storage.setItem("blockedID","");
                    storage.setItem("blockedName","");
                    storage.setItem("nFilterState", 0);
                    storage.setItem("nMemberViewState", 0);
                    SetBFilter();
                } else {
                    txt = "You pressed Cancel!";
                }
                return false;
            };
            ToggleFilter = addButton('필터ON/OFF', 'ToggleFilter');
            ToggleFilter.onclick = function() {
                var nFilterState = Number(storage.getItem("nFilterState"));
                nFilterState++; if (nFilterState > 2) { nFilterState = 0; }
                storage.setItem("nFilterState", nFilterState);
                SetBFilter();
                return false;
            };
            SetBFilter();
            addButton('','');
            btnMemberView = addButton('모아보기', 'btnMemberView');
            btnMemberView.onclick = function() {
                var nMemberViewState = Number(storage.getItem("nMemberViewState"));
                nMemberViewState++; if (nMemberViewState > 1) { nMemberViewState = 0; }
                storage.setItem("nMemberViewState", nMemberViewState);
                SetBFilter();
                return false;
            };

        }
    }
x.__show = true;
//$(posts).each(function (){});//for debug


    function CheckUserData(storage)
    {
        // create default values if there isnt any storage (on first run)
        if (storage.getItem("blockedID") == null){
            storage.setItem("blockedID", "");
        }
        if (storage.getItem("blockedName") == null){
            storage.setItem("blockedName", "");
        }
        if (storage.getItem("nFilterState") == null){
            storage.setItem("nFilterState", "0");
        }
        if (storage.getItem("nMemberViewState") == null){
            storage.setItem("nMemberViewState", "0");
        }
    }
}

var a = document.getElementById('cafe_main');
if (a) a.addEventListener("load", Ready);


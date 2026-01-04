// ==UserScript==
// @name         youtube chat control script＆＆Blacklist extension
// @namespace    mod:delete comments||report comment&&block user&&Get the blocked user channel URL
// @version      2.2.7
// @description  One-click to block，One-click report，One-click delete，Block accounts in bulk
// @author       null
// @match        *://studio.youtube.com/*
// @match        *://*.youtube.com/live_chat_replay*
// @match        *://*.youtube.com/live_chat*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441497/youtube%20chat%20control%20script%EF%BC%86%EF%BC%86Blacklist%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/441497/youtube%20chat%20control%20script%EF%BC%86%EF%BC%86Blacklist%20extension.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let language = navigator.language
    window.location.host ==="studio.youtube.com"&&Add_URL_List ()
    if (window.location.pathname !== "/live_chat"&&window.location.pathname !== "/live_chat_replay") return;
    let height_box;
    height_box = "875px";
    if (window.location.pathname!=window.parent.location.pathname)window.parent.document.querySelector("YTD-LIVE-CHAT-FRAME#chat").style.minHeight= height_box;
    let IsTranslation=false,sc
    const SET = GM_registerMenuCommand(language_("Detailed Settings&Log","详细设置&Log","詳細設定&Log"), () =>Set_());
    let IsMod = false,IsOwner = false
    let Isspecial = document.querySelector("div#top")?.querySelector("#author-name")
    Isspecial&&Isspecial.className=="moderator style-scope yt-live-chat-author-chip"?IsMod=true:IsMod=false
    Isspecial&&Isspecial.className=="owner style-scope yt-live-chat-author-chip"?IsOwner=true:IsOwner=false
    IsOwner&&alert(language_("you are Owner!","你是主播!","あなたはオーナーです!"))
    if(IsOwner)return;
    let Anemati=[],Node_List=[],Node_Log_List = [],Del_List = [],Keylist = [],NoSpamAccount = [],Tex = [],Comment = [],Bot = [],Blocked = [],Key = [],Ng = [];
    let Achan=null,Ollie=null,This=null,BlorUn = null;
    let Ch_m = 0,Node_List_index=0,Delete_interval = 3400,BC= 0 ,Pageleng=0,Spam=0,Normal=0,Untreated=0,doc = Number(localStorage.getItem("doc"))||5,rami = -1,spam_ro = 0,spam_co = 0,err=0,Repeat = 0,YuBi = 0
    let prpr,Ame,Gura,color,Yagoo,Itemslist,color_ames,korone,BlockText
    let Key_l = Number(localStorage.getItem("Key_l"))||16,BBQ = Number(localStorage.getItem("BBQ"))||3,jp_l =Number(localStorage.getItem("jp_l"))||11,en_l = Number(localStorage.getItem("en_l"))||3,Kirara = localStorage.getItem("IsBlock")=="checked"?true:false
    let Isblock=localStorage.getItem("IsBlock"),Isreplace=localStorage.getItem("Isreplace");
    let PageMode = doc ,pages=doc,Page=0,PageN = 1;
    let Main_Menu_Box, Dialogs_Confirm ,Report_Menu_report,Report_Menu_Item,Index_,WTF_1,WTF_2,YMD,YMD_Type,Deleting,Delet_mes,AutoR,my,Kazama;
    let lng_jp = true,lng_en = true,Runing_N = false,IsUntreated=false,Isiput = false,Mio = false,stop=false,Runing_M=false,del_all = false,Selection=true,gift = true,FubuKing=false,checkname = localStorage.getItem("IScheckname")=="checked"?true:false
    let re_=/[\u200b-\u200f\uFEFF\u202a-\u202e]/g
    let re_jp = /[\u0800-\u4e00]|[\u4e00-\u9fa5]/g
    re_jp = /[\u0800-\u4e00]|[\u4e00-\u9fa5]/g
    let re_en = /\b[A-Z]+\w{2,}-*[A-Za-z]*\b/g
    let re_all = /(\b[A-Z]+\w{2,}\b)|[\u0800-\u4e00]{1}|[\u4e00-\u9fa5]{1}|^(<img.*src.*alt.*>)/g
    let New_Chat_Frame = document.querySelector("#contents.yt-live-chat-renderer"),iv=document.querySelector("DIV#input"),Mn = document.querySelector("yt-icon-button#overflow")
    //css
    GM_addStyle(".mes_log_class{font-size:12px;line-height: 25px;text-indent:25px;color: #aaaaaa;}")
    GM_addStyle(".item_class{text-indent:15px;display:inline-block;width:100%}")
    GM_addStyle(".P_key{cursor:pointer;text-indent:25px;width:100%;height:100%;display:inline-block;font-size:12px}")
    GM_addStyle("#key_mes{height:100%;overflow :scroll;overflow-x:auto}")
    GM_addStyle(".Title_top{width:100%;height:100%;text-align:center;display:inline-block;cursor:pointer}")
    GM_addStyle("#keyword_frame{overflow-y:auto;width:100%;height:150px;overflow:hidden}")
    GM_addStyle("#new_div_chat{height:150px;overflow:scroll}")
    GM_addStyle("#settingitem{user-select:none}")
    GM_addStyle("#ChatMes,#Log,#dad:hover{cursor:pointer}")
    GM_addStyle(".pro{color:#f00;font-size: 13px;text-align: center;line-height:16px}")
    GM_addStyle(".ppts{font-size: 14px;line-height: 25px;text-indent:25px;color: #aaaaaa;}")
    GM_addStyle("#Set_off{font-size: 14px;line-height: 21px;text-align:center}")
    GM_addStyle(".shion_P{display:inline-block;text-indent: 0px;}")
    GM_addStyle("#Y{user-select:none;cursor:pointer}")
    GM_addStyle("input[type='button']{border: none;text-align: center;text-decoration: none;font-size: 13px;cursor: pointer;height: 20px;}")
    GM_addStyle("input[type='text']{font-size: 12px;cursor: pointer;height: 16px;}")
    function css_white(){
        color = "rgba(0, 0, 0, 0.23)"
        GM_addStyle(".set_list{width:50%;height:25px;display:inline-block;background-color:rgba(75, 75, 75, 0.2);text-align:center;user-select:none;line-height:25px;cursor:pointer}")
        GM_addStyle(".set_item_list{height :25px;background-color:rgba(0, 0, 0, 0.23);text-indent: 10px;line-height:25px;cursor:pointer;font-size:13px;user-select: none")
        GM_addStyle(".MainWindow_css{height:250px;overflow:hidden;border-bottom:1px;border-style:solid;border-bottom-color:#0241ff;display:inline-flex;flex-direction:column;overflow:hidden}")
        GM_addStyle("textarea{font-size: 12px;resize: none;width:100%;height:144px;overflow-x:hidden;border-left:0px;border-top:0px;border-right:0px;border-bottom:0px;color:#000000;background-color:#f9f9f9}")
    }
    function css_black(){
        color = "#4b4b4b"
        GM_addStyle(".set_list{width:50%;height:25px;display:inline-block;background-color:#363333;text-align:center;user-select:none;line-height:25px;cursor:pointer}")
        GM_addStyle(".set_item_list{height :25px;background-color:#4b4b4b;text-indent: 10px;;line-height:25px;cursor:pointer;font-size:13px;user-select: none")
        GM_addStyle(".MainWindow_css{height:250px;overflow:hidden;border-bottom:1px;border-style:solid;border-bottom-color:#ff00006e;display:inline-flex;flex-direction:column;overflow:hidden}")
        GM_addStyle("textarea{font-size: 12px;resize: none;width:100%;height:144px;overflow-x:hidden;border-left:0px;border-top:0px;border-right:0px;border-bottom:0px;color:#FFFFFF;background-color:#181818}")
    }
    /////////////////////////////////////////////////language/////////////////////////////////////
    function language_(en,zh,jp) {
        switch (language) {
            case "en-US":
                return en
            case "zh-CN":
                return zh
            case "ja":
                return jp
            default:
                return en
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    let Y = document.createElement("div");
    Y.innerHTML =' <span id = "Y" style="height: 24px;width: 24px;background: #0ff0;">◺</span> '
    Y.title = language_("Other Settings & Bulk Actions","其他设置&批量操作","その他の設定&一括操作")
    if (New_Chat_Frame){
        switch (window.getComputedStyle(New_Chat_Frame, null)?.getPropertyValue('border-color'))
        {
            case "rgb(255, 255, 255)":
                css_black()
                color_ames="#ffffff";WTF_1 = "#131313";WTF_2 = "#202020";
                break;
            case "rgb(3, 3, 3)":
                css_white()
                color_ames="#000000";WTF_1 = "#d6d6d6";WTF_2 = "#eeeeee";
                break;
        }
    }
    Itemslist = document.querySelector("#items.yt-live-chat-item-list-renderer");
    if (!Itemslist) return;
    const Important_Frame = document.createElement("div");
    Important_Frame.id = "MainWindow";
    Important_Frame.setAttribute("class","MainWindow_css");
    const shion = document.createElement("div");
    const shion_P1 = document.createElement("div");
    const shion_P2 = document.createElement("div");
    const Setting = document.createElement("div");
    const Settinglist = document.createElement("div");
    const SettingItem = document.createElement("div")
    const O_Item = document.createElement("div");
    const shion_p = document.createElement("span");
    const GetNewMes = document.createElement("input")
    const T_T = document.createElement("span")
    const DellMes = document.createElement("input")
    const date = document.createElement("div");
    O_Item.style.flexGrow="1";O_Item.style.height = "130px";
    Setting.id = "setting";
    shion.id="state";shion.setAttribute("class","set_item_list");shion_p.id="tex"
    shion_P1.setAttribute("class","shion_P");shion_P1.style.width = "60%";
    shion_P2.setAttribute("class","shion_P")
    Settinglist.id = "settinglist";
    SettingItem.id = "settingitem";
    GetNewMes.type = "button";GetNewMes.value = language_("Skip","跳过","スキップ");
    DellMes.type = "button"
    Kirara?DellMes.value = language_("Block","屏蔽","ブロック") :DellMes.value = IsMod?language_("Delete","删除","削除"):language_("Report","举报","報告")
    DellMes.title = language_("arrow key →","方向键 →","矢印キー →");
    GetNewMes.title = language_("arrow key ←","方向键 ←","矢印キー ←");
    T_T.innerText = " "
    shion_P2.appendChild(GetNewMes);shion_P2.appendChild(T_T);shion_P2.appendChild(DellMes);
    DellMes.disabled = true;GetNewMes.disabled = true
    shion_P2.style.display="none"
    for (let i=0;i<2;i++){
        const set_List = document.createElement("div");
        const set_Item_List = document.createElement("div");
        const Title = document.createElement("span");
        Title.setAttribute("class","Title_top");
        set_List.setAttribute("class","set_list");
        set_Item_List.setAttribute("class","set_item_list");
        set_Item_List.style.display = "none";
        switch (i)
        {
            case 0:
                set_List.id = "Input_Key_List";
                set_Item_List.id = "Input_Key_Item";
                set_Item_List.style.display = "";
                Title.innerHTML = language_("Keys","关键词","キーワード")
                Title.id = "T1";
                break;
            case 1:
                set_List.id = "gauging";
                set_Item_List.id = "gauging_Item";
                Title.innerHTML = language_("Comment","评论","コメント");
                Title.id = "T2";
                break;
        }
        Settinglist.appendChild(set_List);
        set_List.appendChild(Title);
        SettingItem.appendChild(set_Item_List);
    }
    shion_P1.appendChild(shion_p);
    shion.appendChild(shion_P1);shion.appendChild(shion_P2);
    Setting.appendChild(Settinglist);Setting.appendChild(SettingItem);
    Important_Frame.appendChild(Setting);Important_Frame.appendChild(shion);
    const nextmes = document.createElement("div");
    nextmes.id = "next"
    nextmes.innerText = "▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼"
    nextmes.style.height = "25px";nextmes.style.cursor="pointer";nextmes.style.userSelect="none";nextmes.style.background="rgba(80, 80, 81, 0.39)";
    nextmes.title = language_("Open settings after 1 second","1秒后打开设置","1秒後に設定を開く");nextmes.before(Important_Frame);
    Important_Frame.appendChild(nextmes)
    New_Chat_Frame.before(Important_Frame);
    const MainWindow = document.getElementById("MainWindow");
    const Inputs = document.getElementById("Input_Key_Item");
    const gauging_Item = document.getElementById("gauging_Item");
    Inputs.style.display="none"
    gauging_Item.style.display=""
    const TItle_1= document.getElementById("Input_Key_List");
    const TItle_2= document.getElementById("gauging");
    const gauging_0 = document.createElement("div");
    const gauging_1 = document.createElement("div");
    const gauging_2 = document.createElement("div");
    const gauging_00 = document.createElement("span");
    const gauging_01 = document.createElement("span");
    const gauging_10 = document.createElement("span");
    const gauging_11 = document.createElement("span");
    const gauging_20 = document.createElement("span");
    const gauging_21 = document.createElement("span");
    gauging_0 .style.display = "inline-block";gauging_0.id = "Key_l";gauging_0.style.textIndent="0px";
    gauging_00.innerText = language_("Filter word count:","过滤的评论字数:","コメントの長さ:");
    gauging_01.innerText = Key_l;gauging_01.setAttribute('contenteditable', 'true');gauging_01.addEventListener('keydown', function (e) {if(e.keyCode == 13)gauging_01.blur()})
    gauging_1.style.display = "inline-block";gauging_1.id = "BBQ";
    gauging_10.innerText = language_("Hits:","连续次数:","連打回数:");
    gauging_11.innerText = BBQ;gauging_11.setAttribute('contenteditable', 'true');gauging_11.addEventListener('keydown', function (e) {if(e.keyCode == 13)gauging_11.blur()});
    gauging_2.id = "Interval";gauging_2.style.display = "inline-block";
    gauging_20.innerText = language_("Max Waiting Time(ms):","最大等待时间(ms):","最大待ち時間(ms):");
    gauging_21.innerText = Delete_interval;gauging_21.setAttribute('contenteditable', 'true');
    gauging_0.appendChild(gauging_00);gauging_0.appendChild(gauging_01);
    gauging_1.appendChild(gauging_10);gauging_1.appendChild(gauging_11);
    gauging_2.appendChild(gauging_20);gauging_2.appendChild(gauging_21);
    gauging_Item.appendChild(gauging_0);gauging_Item.appendChild(gauging_1);gauging_Item.appendChild(gauging_2);
    MainWindow.appendChild(O_Item);
    const New_Chat = document.createElement("div");
    const Gather_Set = document.createElement("div");
    const Keyword_Frame = document.createElement("div");
    const Keyword_Frame_Textarea = document.createElement("textarea");
    Keyword_Frame_Textarea.id = "keys"
    New_Chat.id = "new_div_chat";
    Keyword_Frame.style.display = "none";
    Gather_Set.id = "Gather_Set";Gather_Set.style.display = "none";Gather_Set.style.backgroundColor = color;Gather_Set.style.opacity=0.8;Gather_Set.style.height = "100%";
    Keyword_Frame.id = "keyword_frame";
    Keyword_Frame_Textarea.placeholder = language_("Paste keywords here and click Add","复制关键词到这后点添加","ここにキーワードを貼り付けて、[Add]をクリックします");
    Keyword_Frame_Textarea.style.overflowY="scroll";Keyword_Frame_Textarea.style.overflowX="scroll";Keyword_Frame_Textarea.style.whiteSpace="pre";
    Keyword_Frame.appendChild(Keyword_Frame_Textarea);
    O_Item.appendChild(Keyword_Frame);
    O_Item.appendChild(New_Chat);
    O_Item.appendChild(Gather_Set);
    const T__T = document.createElement("span")
    T__T.innerText = " "
    const Add_Input_Key = document.createElement("input")
    Add_Input_Key.id = "add_i_key";Add_Input_Key.type = "text";Add_Input_Key.placeholder = language_("Enter keyword","输入关键词","キーワードを入力");Add_Input_Key.maxlength = "500";
    Inputs.appendChild(Add_Input_Key)
    const Add_Button = document.createElement("input")
    Add_Button.type = "button";Add_Button.value = "Add";Add_Button.id = "add_b_key";
    Inputs.appendChild(Add_Button);Inputs.appendChild(T__T);
    const Del_Button = document.createElement("input")
    Del_Button.type = "button";Del_Button.value = "Delete";Del_Button.id = "delete_key";
    Inputs.appendChild(Del_Button)
    const Addrun = document.getElementById("overflow")
    Addrun.before(Y)
    let miko = document.createElement("span")
    miko.id = "miko";miko.innerText = 0
    let kanata = document.createElement("div")
    kanata.style.display="inline-block"
    let kanata_1 = document.createElement("div")
    kanata.style.cssText+="font-size:16px"
    const rami_1 = document.createElement("span")
    rami_1.innerText="0"
    const rami_m = document.createElement("span")
    rami_m.innerText="/"
    kanata_1.appendChild(miko);kanata_1.appendChild(rami_m);kanata_1.appendChild(rami_1);
    kanata.appendChild(kanata_1)
    Addrun.before(kanata)
    /////////////////////////Detailed settings /////////////////////////////////
    let bo =document.querySelector("yt-live-chat-app")
    let TOP_div = document.createElement("div")
    TOP_div.id = "TOPdiv";TOP_div.style.position="absolute";TOP_div.style.background="rgba(33, 33, 33,0.92)";TOP_div.style.visibility="hidden";
    let IsTaKo = '<div style="height: 50px;">'
    + '<div style="color: rgb(255, 255, 255);text-align:right;padding-top: 5px;padding-right: 10px;">'
    + '<span id="Set_off" style="display: inline-block;cursor:pointer;width: 21px;height: 21px">×</span>'
    + '</div>'
    + '</div>'
    + '<div style="overflow-y: scroll;overflow-x: hidden;">'
    + '<div style="height: 30px;width: 100%;display: inline-flex">'
    + '<div class="ppts" style="width: 85%;">'
    + '<span>' + language_("Block Users", "屏蔽用户", "ユーザーをブロックする") + '</span>'
    + '</div>'
    + '<div class="ppts" style="width: 15%">'
    + '<input id="ISblock" type="checkbox" ' + Isblock + '>'
    + '</div>'
    + '</div>'
    + '<div style="height: 30px;width: 100%;display: inline-flex">'
    + '<div class="ppts" style="width: 85%;"><span>' + language_("Replace chat comments", "替换聊天评论", "チャットコメントを置き換える") + '</span>'
    + '</div>'
    + '<div class="ppts" style="width: 15%">'
    + '<input id="ISreplace" type="checkbox" ' + Isreplace + '>'
    + '</div>'
    + '</div>'
    + '<div style="height: 30px;width: 100%;display: inline-flex">'
    + '<div class="ppts" style="width: 85%;"><span>' + language_("Also check username", "同时检查用户名字", "ユーザー名もチェック") + '</span>'
    + '</div>'
    + '<div class="ppts" style="width: 15%">'
    + '<input id="IScheckname" type="checkbox" ' + localStorage.getItem("IScheckname") + '>'
    + '</div>'
    + '</div>'
    + '<div style="height: 30px;width: 100%;display: inline-flex">'
    + '<div class="ppts" style="width: 85%;">'
    + '<span>' + language_("Show Log", "输出log", "ログを表示") + '</span>'
    + '</div>'
    + '<div class="ppts" style="width: 15%">'
    + '<input id="Log_Show" type="checkbox">'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div style="width: 100%;height: 10px;background-color:#f9f9f947">'
    + '</div>'
    + '<div id="antetype_mes" style="display: none;border-bottom: 1px solid #666;border-top-width: 1px; border-left-width: 1px;border-left-style: solid;border-top-style: solid;">'
    + '<div style="display: inline-flex; width: 100%">'
    + '<div id="Log_Name" class="ppts" style="width: 85%;color:#ffffff">　　　＝_________________________________＝'
    + '</div>'
    + '<div id="antetype" class="ppts" style="width: 15%;">'
    + '<input id="Unblock" type="checkbox"  >'
    + '</div>'
    + '</div>'
    + '<div id = "mes_log" class = "mes_log_class">'
    + '</div>'
    + '</div>'
    + '<div id = "AllLog" style=" border-bottom-width: 0px; width: 100%;height: 25px;background-color:#f9f9f930;">'
    + '<div style="display:inline-flex; width: 96%" class="ppts"><div style="width:50%">' + language_("Sort", "排序:", "ソート")
    +'<select id="Category_sort">'
    +'<option value="name">' + language_("Name", "名字", "名前")+ '</option>'
    +'<option value="Blocked">' + language_("Blocked", "已屏蔽", "ブロック済み") + '</option>'
    +'<option value="nene" style="display:none">' + language_("Untreated", "未处理", "未処理") + '</option>'
    +'<option value="URL_">' + language_("Channel URL", "频道URL", "チャネルURL") + '</option>'
    +'</select>'
    +'</div>'
    +'<div><input id="del_a"style="padding-right: 2px;padding-left: 2px;visibility:hidden" value = "'+language_("Block","屏蔽","ブロック")+'" title = "'+ language_("","","")+'" type="button">'
    +' '
    +'<input id="All_Block" style="padding-right: 2px;padding-left: 2px;" type="button" value = "'+language_("Single","单选","一択")+'" title = "'+ language_("","","")+'">'
    +' '
    +'<input id="Inverse" style="padding-right: 2px;padding-left: 2px;visibility:hidden" type="button" value = "'+language_("Inverse","逆","逆")+'" title = "'+ language_("","","")+'">'
    +'</div>'
    +'</div>'
    +'<div id="Block_Logs" style="overflow-y: scroll;overflow-x:hidden;">'
    +'</div>'
    +'<div id = "Options" class="ppts">'
    +'<input id="up_" type="button"  value="<">'
    +'<input id ="page_" type="text" style=" width:20px" value = "1">'
    +'<input id="dow_" type="button" value=">"> '
    +'<input id="max_"type="button" value="Max:1">'
    +"&#12288"
    +'<input id="Untreated_"type="button" value=' + language_("Untreated","未处理","未処理") +'>'
    +'<input id ="isco" type="text" style="width:30px" value = "'+doc+'">/Page'
    +'<input id="OTL" type="button"  value="Backup" title ="'+ language_("Copy all blocked user information to clipboard","复制所有屏蔽的用户信息到剪切板","ブロックされたすべてのユーザー情報をクリップボードにコピーします")+'"> '
    +'</div>'
    +'</div>'
    +'<div id="Dump" style="display:none">'
    +'</div>'
    TOP_div.innerHTML = IsTaKo
    bo.appendChild(TOP_div)
    let OTL = document.getElementById("OTL")
    Mn.after(Y)
    let pro = document.createElement("div")
    pro.id = "Pro";pro.style.position="relative";pro.style.display = "none";
    MainWindow.appendChild(pro);
    pro.innerHTML = '<div id="PRO_1" class="pro" style="height: 16px;background:rgba(75,75,75,0.7)"></div>'
    let Zeta = '<div style="text-align:center">language settings:(0 or 200)don\'t get this language</div><div style="height: 10px;"></div>'
    +'<div style="text-align:center;display:flex;line-height: 25px;background:rgba(128,128,128,0.8)">'
    +'<div style="width:50%;height: 25px;display:flex">'
    +'<div style="min-width: 80px;text-align:right">'+language_("Japanese", "日语", "日本語")+'</div>'
    +'<div style="min-width: 70px;text-align:right;">'+language_("Word Count>", "字数>", "文字数>")+'</div>'
    +'<div><input id="lng_jp" type="text" style="width: 20px;height: 11px;" value="'+jp_l+'"></div>'
    +'</div>'
    + '<div style="width:50%;height: 25px;display:flex;background:rgba(128,128,128,0.8)">'
    + '<div style="min-width: 80px;text-align:right">'+language_("English", "英语", "英語")+'</div>'
    +'<div style="min-width: 70px;text-align:right;">'+language_("Word Count>", "单词数>", "単語数>")+'</div>'
    +'<div><input id="lng_en" type="text" style="width: 20px;height: 11px;"value="'+en_l+'"></div>'
    +'</div>'
    +'</div>'
    Gather_Set.innerHTML = Zeta;
    shion_p.innerText=count();
    /////////////////////function/////////////////
    function Getmes(){
        shion_p.innerText = count();
        if(BC>299){
            for(let i = 299;i>=99;i--){
                New_Chat.children[i].remove()
                BC--
            }
        }
        for(let i=Node_List.length-1;i>=0;i--){
            if (Node_List[i].Isspam===null&&!Node_List[i].Repeat){
                Index_=i
                break
            }
        }
        if (Index_!=null){
            Ollie = Node_List[Index_].node
            let Fragment = document.createDocumentFragment()
            let Item_Top = document.createElement("div")
            Item_Top.id = Index_;Item_Top.setAttribute("class","item_class");Item_Top.title = "Name： "+Node_List[Index_].name;Item_Top.style.fontWeight="bold";Item_Top.style.backgroundColor=BC%2==0?WTF_1:WTF_2;
            let Key = NGw()
            for (let i = 0,L = Node_List.length;i<L;i++){
                let Mm = 0
                if(Node_List[Index_].name_src == Node_List[i].name_src&&Node_List[i].Isspam==null){
                    let Item = document.createElement("div")
                    let Item_a = document.createElement("span")
                    let Item_b = document.createElement("span")
                    Item.id = Node_List[i].index;Item.style.display = "flex";Item.style.textIndent = "0px";
                    let Zz = 0,Cc =0,Xx = 0
                    for (let item of Key){
                        Cc = Node_List[i].Message.indexOf(item)
                        if (Cc>-1){
                            let Item_N = document.createElement("span")
                            let Item_M = document.createElement("span")
                            let mes=Node_List[i].Message.slice(Zz,Cc);
                            Xx = item.length
                            Zz = Cc+Xx
                            Item_N.innerText = mes
                            Item_b.append(Item_N)
                            Item_M.innerText = item;Item_M.style.color = "red"
                            Item_b.append(Item_M)
                            Mm++
                        }
                    }
                    Xx = Node_List[i].Message.length
                    let Item_E = document.createElement("span")
                    Item_E.innerText = Node_List[i].Message.slice(Zz,Xx)
                    Item_a.innerText = Node_List[i].Message
                    Item_b.append(Item_E)
                    Mm>1?Item.append(Item_b):Item.prepend(Item_a)
                    if (Node_List[i].dubious)Item.style.color = "red"
                    if (Node_List[i].interval<1)Item.style.background="rgba(255, 218, 74, 0.2) "
                    Item_Top.prepend(Item)
                    Fragment.prepend(Item_Top)
                }
            }
            New_Chat.prepend(Fragment)
            BC++
            shion_P2.style.display=""
        }else{
            Ollie=null;Index_= null;
            Mes(language_("No New Comment!","没有新的评论!","新しいコメントなし!"))
            shion_P2.style.display="none"
        }
    }
    function Action(){
        let first = New_Chat.firstElementChild
        first.style.textDecoration="line-through";first.style.fontWeight="normal";first.style.opacity = 0.4;
        if(Kirara){
            Node_List[Index_].act ="Block"
            Node_List.forEach((mes)=>{
                if (Node_List[Index_].name_src == mes.name_src){
                    mes.Isblock = true;mes.Isspam =true;mes.regexp!="nullll"&&Key.push(mes.regexp);
                }
            })
            first.style.color="red"
            Node_List[Index_].act =="Block"&&Blocked.push(Node_List[Index_].name_src)
            Queue(Ollie,Index_)
        }else{
            Node_List.forEach((mes)=>{
                if (Node_List[Index_].name_src == mes.name_src){
                    if (mes.Isspam===null) {
                        mes.Isspam =true;mes.regexp!="nullll"&&Key.push(mes.regexp);
                        if(IsMod){
                            mes.act = "Delete"
                            Queue(mes.node,mes.index)
                        }else{
                            mes.act = Anemati.includes(Node_List[Index_].name_src)?"Block":"Report"
                        }
                    }
                }
            })
            first.style.color="yellow"
            if(!IsMod){
                Node_List[Index_].act =="Block"&&Blocked.push(Node_List[Index_].name_src)
                Queue(Ollie,Index_)
            }
        }
        Node_List[Index_].act!="Block"&&Anemati.push(Node_List[Index_].name_src)
        Ollie=null;Index_=null;
        shion_p.innerText=count()
        Key=[...new Set(Key)]
        Untreated?Getmes():shion_P2.style.display="none"
    }
    function skip(){
        Mes(language_("Comment skipped","已跳过评论","スキップしました"),"skip")
        let Top =New_Chat.firstElementChild;
        for (let i = 0,l =Top.children.length;i<l;i++){
            Node_List[Top.children[i].id*1].Isspam = false;
        }
        Top.style.color="green";Top.fontWeight="normal";Top.style.opacity = 0.5;
        Ollie=null;Index_=null;
        shion_p.innerText=count()
        Untreated?Getmes():shion_P2.style.display="none"
    }
    function Towa(){
        let n = []
        Bot = Node_List.filter((item)=>{
            let Na = true
            if (item.Isspam){
                Na=n.includes(item.name_src)
                !Na&&n.push(item.name_src)
            }
            return !Na
        })
        let key = NGw()
        let ng = ''
        sort(false,"Key_Ii",key)
        key.forEach((item)=>{
            let div = ""
            if(item!=",")div = '<div style="border-radius:25px;cursor:pointer;height: 25px;">&nbsp&nbsp&nbsp'+item+'&nbsp&nbsp&nbsp</div>'
            ng += div
        })
        let data ='<div style="font-size: 14px;color: #aaaaaa;text-align:center;display:flex;line-height: 25px">'
        +'<div style="width:50%;height: 25px;display:flex;line-height: 25px">'
        +'<div style="width:30%;text-align:right">Spam:</div>'
        +'<div style="width:20%;text-align:left">'+Spam+'</div>'
        +'<div style="width:30%;text-align:right">Bot:</div>'
        +'<div style="width:20%;text-align:left">'+Bot.length+'</div>'
        +'</div>'
        +'<div style="width:50%;height: 25px;display:flex">'
        +'<div style="width:30%;text-align:right">Normal:</div>'
        +'<div style="width:20%;text-align:left">'+Normal+'</div>'
        +'<div style="width:30%;text-align:right">Pending:</div>'
        +'<div style="width:20%;text-align:left">'+Untreated+'</div>'
        +'</div>'
        +'</div>'
        +'<div style="font-size: 14px;color: #aaaaaa;text-align:center;display:flex;line-height: 25px">'
        +'<div style="width:50%;height: 25px;display:flex">'
        +'<div style="width:30%;text-align:right">Blocked:</div>'
        +'<div style="width:20%;text-align:left">'+spam_co+'</div>'
        +'<div style="width:30%;text-align:right">Report:</div>'
        +'<div style="width:20%;text-align:left">'+spam_ro+'</div>'
        +'</div>'
        +'<div style="width:50%;height: 25px;display:flex">'
        +'<div style="width:30%;text-align:right">Error:</div>'
        +'<div style="width:20%;text-align:left">'+err+'</div>'
        +'<div style="width:30%;text-align:right">Repeat:</div>'
        +'<div style="width:20%;text-align:left">'+Repeat+'</div>'
        +'</div>'
        +'</div>'
        +'<div style="background: #5f5f5f82;width:100%;font-size: 14px;color: #aaaaaa;text-align:center;line-height: 25px">NG Word</div>'
        +'<div id = "NG" style=" overflow-y: scroll;background: #ffffff0a;width:100%;display:flex;flex-flow: row wrap;font-size: 14px;color: #aaaaaa;line-height: 25px;min-height: 50px;max-height: 290px;word-wrap:break-word">'+ng
        +'</div>'
        +'<div style="text-align:center;"><textarea id="NG_Key" type="text" style="width:94%"></textarea></div>'
        date.innerHTML = data
        let NG= document.getElementById("NG");
        let NG_Key = document.getElementById("NG_Key");
        NG_Key.placeholder = language_("Click on the words to add them to the text box","点击单词添加到文本框","単語をクリックしてテキストボックスに追加します");
        NG_Key.style.fontSize = "13px"
        NG.onclick = null;NG.onmouseout = null;NG.onmouseover = null;
        NG.onclick = (e)=>{
            if (e.target.id!="NG"){
                let Key_v = e.target.innerText.trim()
                let NG_v = NG_Key.value
                NG_Key.value += NG_v?","+Key_v:Key_v
                e.target.style.display = "none"
            }
        }
        NG.onmouseout = (e)=>{
            if (e.target.id!="NG"){
                e.target.style.background = ""
            }
        }
        NG.onmouseover = (e)=>{
            if (e.target.id!="NG"){
                e.target.style.background = "#606060"
            }
        }

    }
    function NGw(){
        let key_ = Key.length?DellArray("",[...new Set(Key.toString().split(".*"))]):[]
        return key_
    }
    setInterval(()=>{
        if(!stop&&Untreated){
            let Top=New_Chat?.firstElementChild
            if (Top&&Node_List[Top.id*1].Isspam==null){
                Top.remove()
                BC--
            }else if(Top&&Node_List[Top.id*1].Isspam==false){
                Top.style.color="green";Top.fontWeight="normal";Top.style.opacity = 0.5;
            }else if(Top&&Node_List[Top.id*1].Isspam){
                Top.style.textDecoration="line-through";Top.style.fontWeight="normal";Top.style.opacity = 0.4;Top.style.color= Node_List[Top.id*1].Isblock?"red":"yellow";
            }
            Ollie=null;Index_= null;
            Getmes()
        }
    },60000)
    //===================================================onev===============================================================================
    let All_Block = document.getElementById("All_Block")
    let Inverse = document.getElementById("Inverse")
    let up_ = document.getElementById("up_");
    let max_ =document.getElementById("max_");
    let page_= document.getElementById("page_");
    let dow_ = document.getElementById("dow_");
    let isco_ = document.getElementById("isco");
    let Untreated_ = document.getElementById("Untreated_");
    let Category = document.querySelector("#Category_sort")
    let BlockLogs=document.querySelector("#Block_Logs")
    if (IsMod)Category.options[3].style.display = ""
    let golo,URL
    lng_jp = document.getElementById("lng_jp");lng_en= document.getElementById("lng_en");
    Itemslist.ondblclick = (e) =>{
        switch (e.target.id)
        {
            case "author-name":
                URL = e.target.parentNode.parentNode.parentNode.data.authorExternalChannelId
                URL&&window.open("https://www.youtube.com/channel/" + URL +"/about")
        }
    }
    Itemslist.onmouseover = (e) =>{
        switch (e.target.id)
        {
            case "author-name":
                e.target.style.cursor = "pointer"
        }
    }
    lng_jp.oninput = ()=>{
        clearTimeout(golo)
        golo =setTimeout(()=>{
            let isn = lng_jp.value.match(/[0-9]+/g)
            isn =isn?isn[0]*1:0
            !(isn)?jp_l = 200:jp_l = isn>10?isn:11
            lng_jp.value = jp_l
            Key_l = jp_l>en_l?jp_l:en_l
            gauging_01.innerText = Key_l
            localStorage.setItem("Key_l",Key_l);localStorage.setItem("jp_l",jp_l);
            lng_jp.blur()
        },1500)
    }
    lng_en.oninput = ()=>{
        clearTimeout(golo)
        golo =setTimeout(()=>{
            let isn = lng_en.value.match(/[0-9]+/g)
            isn =isn?isn[0]*1:0
            !(isn)?en_l = 200:en_l = isn>3?isn:3
            lng_en.value= en_l
            Key_l = jp_l>en_l?jp_l:en_l
            gauging_01.innerText = Key_l
            localStorage.setItem("Key_l",Key_l);localStorage.setItem("en_l",en_l);
            lng_en.blur()
        },1500)
    }
    dow_.onclick = function(){
        if(PageN<Math.ceil(Pageleng/PageMode)) PageN++
        if(pages<Pageleng){
            Page=Number(Page)+Number(PageMode);
            pages=Number(pages)+Number(PageMode)
        }
        page_.value = PageN
        Log_List(YMD,Page,pages)
        BlockLogs.scrollTop=BlockLogs.scrollHeight
    }
    up_.onclick = function(){
        if(Page-PageMode>=0){
            Page=Page-PageMode;
            pages=pages-PageMode;
            if(PageN>1) PageN--
        }
        page_.value = PageN
        Log_List(YMD,Page,pages)
        BlockLogs.scrollTop=BlockLogs.scrollHeight
    }
    isco_.oninput = ()=>{
        if(!isco_.value)return
        doc = isco_.value<1||isNaN(isco_.value)?50:Number(isco_.value)
        isco_.value = doc
        localStorage.setItem("doc",doc)
        PageMode = doc;pages = doc;Page=0;PageN = 1
        page_.value=PageN
        Log_List(YMD,Page,pages)
        BlockLogs.scrollTop=BlockLogs.scrollHeight
    }
    page_.oninput = ()=>{
        pages=doc
        if (page_.value<=Math.ceil(Pageleng/PageMode)){
            if(page_.value<1)page_.value=1
            pages = pages * page_.value
        }else{
            page_.value = Math.ceil(Pageleng/PageMode)
            pages = pages * page_.value
        }
        Page=pages-PageMode
        Log_List(YMD,Page,pages)
    }
    max_.onclick = function(){
        PageMode = doc;pages=doc;Page=0;PageN = 1
        let max =Math.ceil(Pageleng/PageMode)
        PageN = max
        pages = pages * max
        Page=pages-PageMode
        page_.value = PageN
        Log_List(YMD,Page,pages)
        BlockLogs.scrollTop=BlockLogs.scrollHeight
    }
    Untreated_.onclick = function(){
        let LogNames =[]
        Node_Log_List = Node_List.filter((item)=>{
            return item.Isspam===null
        })
        Node_Log_List = Sorting(Node_List,Node_Log_List)
        Untreated_.value = Untreated+ "  " + language_("Untreated", "未处理", "未処理")
        All_Block.style.display = ""
        page_.value = 1
        IsUntreated = true
        Category.options[2].style.display = "";Category.selectedIndex=2;Category.disabled = true;
        Page= 0;pages=doc;PageN = 1
        Log_List(Node_Log_List,Page,pages,"name",false)
        BlockLogs.scrollTop=BlockLogs.scrollHeight
    }
    OTL.onclick = function(){
        let log=""
        Node_List.forEach((item)=>{
            if(item.Isblock&&item.URL){
                log += item.name+"：["+item.Message+"]\n"+item.URL+"\n--------------------------------------------------------------------------------------------------------------\n"
            }
        })
        log&&navigator.clipboard.writeText(log)
    }
    Y.onclick = ()=>{
        if (event.shiftKey==true){
            Important_Frame.style.display=Important_Frame.style.display=="none"?"":"none"
            if(Important_Frame.style.display=="none"){
                Yagoo.disconnect()
            }else{
                Yagoo.disconnect()
                Itemslist = document.querySelector("#items.yt-live-chat-item-list-renderer");
                Yagoo.observe(Itemslist, {
                    childList: true,
                })
            }
        }else{
            Koyori(true)
            Set_();
            Towa()
        }
    }
    New_Chat.ondblclick = (e) =>{
        if (e.target.nodeName=="SPAN"&&e.target.parentNode.id*1 > -1)window.open(Node_List[e.target.parentNode.id*1].URL+"/about")
    }
    New_Chat.onmouseout = (e)=>{
        let node = e.target.parentNode.parentNode
        if (node.className=="item_class"&&(node.previousSibling||Untreated==0))node.style.opacity = 0.4
    }
    New_Chat.onmouseover = (e)=>{
        let node = e.target.parentNode.parentNode
        if (node.className=="item_class")node.style.opacity = 1
    }
    document.addEventListener('keyup', logKey);
    function logKey(e) {
        let Isinput = document.activeElement.id == "input"
        switch (e.code)
        {
            case "ArrowRight":
                if (Isinput)return
                if (New_Chat.style.display == "none"){
                    Keyword_Frame.style.display = "none"
                    Gather_Set.style.display = "none"
                    New_Chat.style.display = ""
                }else{
                    Ollie&&!Node_List[Index_].Isblock?Action():Getmes()
                }
                break;
            case "ArrowLeft":
                if (Isinput)return
                if (New_Chat.style.display == "none"){
                    Keyword_Frame.style.display = "none"
                    Gather_Set.style.display = "none"
                    New_Chat.style.display = ""
                }else{
                    Ollie?skip():Getmes()
                }
                break;
            case "ArrowUp":
                document.activeElement.id =="input"&&event.preventDefault()
                if (!Comment.length||Isiput)return
                Comment.length-1>rami&&rami++
                iv.innerHTML=Comment[rami];iv.dispatchEvent(new InputEvent("input"));
                break;
            case "ArrowDown":
                document.activeElement.id =="input"&&event.preventDefault()
                if (!Comment.length||Isiput)return
                rami = rami<0?Comment.length:rami
                rami>0&&rami--
                iv.innerHTML=Comment[rami];iv.dispatchEvent(new InputEvent("input"));
                break;
            case "Enter":
                rami = -1
                break;
            case "NumpadEnter":
                rami = -1
        }
    }
    Add_Button.onclick = function addkey() {
        let KeyItemList_="",LogNames=[]
        if (Add_Input_Key.value != ""){
            let cdk = Add_Input_Key.value.trim()
            Keylist.push(cdk)
        }else if (Keyword_Frame_Textarea.value!=""){
            Keylist=Keyword_Frame_Textarea.value.trim().split('\n')
            DellArray("",Keylist)
        }
        Add_Input_Key.value = ""
        Node_List.filter((item)=>{
            let Na = true
            if (item.Isspam){
                Na=LogNames.includes(item.Message)
                !Na&&Keylist.push(item.Message)
                !Na&&LogNames.push(item.Message)
            }
            return !Na
        })
        Keylist=[...new Set(Keylist)]
        for (let i=0,l=Keylist.length;i<l;i++){
            KeyItemList_+=(i+1== l)?Keylist[i]:Keylist[i]+"\n";
        }
        Del_Button.value = Keylist.length+"Delete"
        Keyword_Frame_Textarea.value = KeyItemList_
    }
    Del_Button.onclick = function () {
        Keylist = []
        Del_Button.value = "Delete"
        Add_Input_Key.value = ""
        Keyword_Frame_Textarea.value = ""
    }
    GetNewMes.onclick = function () {
        if (New_Chat.style.display == "none"){
            Keyword_Frame.style.display = "none"
            Gather_Set.style.display = "none"
            New_Chat.style.display = ""
        }else {
            Ollie&&skip()
        }
    }
    shion_P2.onmouseenter = ()=>{
        iv&&iv.blur()
        New_Chat.scrollTop=0
        Kazama=setTimeout(()=>Koyori(true),400)
    }
    shion_P2.onmouseleave = ()=>{
        clearTimeout(Kazama);Kazama=null
        !FubuKing&&Koyori(false)
    }
    DellMes.onclick = function () {
        if (New_Chat.style.display == "none"){
            Keyword_Frame.style.display = "none"
            Gather_Set.style.display = "none"
            New_Chat.style.display = ""
        }else{
            Ollie&&Action()
        }
    }
    Settinglist.onclick = function (e){
        let LogNames = []
        switch (e.target.id)
        {
            case "T1":
                if(Inputs.style.display="none" )Inputs.style.display="";
                if (Inputs.style.display==""){
                    TItle_1.style.backgroundColor=color;TItle_2.removeAttribute("style")
                    gauging_Item.style.display = "none"
                    New_Chat.style.display = "none"
                    Keyword_Frame.style.display = ""
                    Gather_Set.style.display = "none";
                    let KeyItemList_ = ""
                    Node_List.filter((item)=>{
                        let Na = true
                        if (item.Isspam){
                            Na=LogNames.includes(item.Message)
                            !Na&&Keylist.push(item.Message)
                            !Na&&LogNames.push(item.Message)
                        }
                        return !Na
                    })
                    Keylist=[...new Set(Keylist)]
                    for (let i=0,l=Keylist.length;i<l;i++){
                        KeyItemList_+=(i+1== l)?Keylist[i]:Keylist[i]+"\n";
                    }
                    Del_Button.value = Keylist.length+"Delete"
                    Keyword_Frame_Textarea.value = KeyItemList_
                }
                break;
            case "T2":
                if(gauging_Item.style.display="none")gauging_Item.style.display="";
                if (gauging_Item.style.display==""){
                    TItle_1.removeAttribute("style");TItle_2.style.backgroundColor=color
                    Inputs.style.display = "none"
                    New_Chat.style.display = ""
                    Keyword_Frame.style.display = "none"
                    Gather_Set.style.display = "none";
                }
                break;
        }
    }
    SettingItem.onclick =function(e){
        if(e.target.nodeName=="SPAN"){
            switch (e.target.parentNode.id)
            {
                case "Key_l":
                    gauging_01.focus();gauging_01.innerText= "";
                    break;
                case "BBQ":
                    gauging_11.focus();gauging_11.innerText= "";
                    break;
                case "Interval":
                    gauging_21.focus();gauging_21.innerText= "";

            }
        }
    }
    Gather_Set.onmouseleave = ()=>{
        if(Keyword_Frame.style.display != "none") return
        !FubuKing&&Koyori(false)
        New_Chat.style.display = ""
        Keyword_Frame.style.display = "none"
        Gather_Set.style.display = "none"
    }
    SettingItem.onmouseover = function(e){
        if(e.target.nodeName=="SPAN"){
            switch (e.target.parentNode.id)
            {
                case "Key_l":
                    e.target.title = language_("Set a number greater than 10","设置大于10的数","10より大きい数を設定");
                    break;
                case "BBQ":
                    e.target.title = language_("Set a number greater than 1 and less than 10","设置大于1小于10的数字","1より大きく10より小さい数値を設定して");
                    break;
                case "Interval":
                    e.target.title = language_("Set a number greater than 2000","设置大于2000的数","2000より大きい数を設定");
            }
        }
    }
    gauging_01.onblur = ()=>{
        let x=gauging_01.innerText
        let xx=parseInt(x)
        typeof xx=='number'&&x!=""&&!isNaN(xx)&&Math.abs(xx)>10?Key_l=Math.abs(xx):Key_l= Key_l
        gauging_01.innerText=Key_l
        localStorage.setItem("Key_l",Key_l)
    }
    gauging_11.onblur = ()=>{
        let x=gauging_11.innerText
        let xx=parseInt(x)
        typeof xx=='number'&&x!=""&&!isNaN(xx)&&Math.abs(xx)>2?BBQ=Math.abs(xx):BBQ= BBQ
        gauging_11.innerText=BBQ
        localStorage.setItem("BBQ",BBQ)
    }
    gauging_21.onblur = ()=>{
        let x=gauging_21.innerText
        let xx=parseInt(x)
        typeof xx=='number'&&x!=""&&!isNaN(xx)&&Math.abs(xx)>2000?Delete_interval=Math.abs(xx):Delete_interval= Delete_interval
        gauging_21.innerText=Delete_interval
    }
    nextmes.onmouseout = ()=>{
        clearTimeout(korone)
    }
    nextmes.onmouseover = ()=>{
        clearTimeout(korone);korone=null
        korone=setTimeout(()=>{
            Koyori(true)
            iv&&iv.blur()
            if(Keyword_Frame.style.display != "none") return
            New_Chat.style.display = New_Chat.style.display == "none"?"":"none"
            Keyword_Frame.style.display = "none"
            Gather_Set.style.display = Gather_Set.style.display == "none"?"":"none"
        },1000)
    }
    rami_1.onmouseover = ()=>{
        rami_1.title = Kirara?"Blcoked":"Reported"
    }
    //===================================================filter================================================================================
    function Iroha(mes,Height){
        let reen =mes.match(re_en)
        let enl = reen?reen.length:0
        let rejp =mes.match(re_jp)
        let jpl = rejp?rejp.length:0
        let reall=mes.match(re_all)
        let all_l =reall?reall.length:0
        let save = (all_l > Key_l)||(enl>en_l)||(jpl>jp_l)
        return save
    }
    Yagoo = new MutationObserver((Guestbook) => {
        Guestbook.forEach(function (MessageList) {
            MessageList.addedNodes.forEach(function (node) {
                if (node.nodeName!="YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER")return;
                const Messages_EL = node.querySelector("#message");
                const Yname = node.querySelector("#author-name");
                const may = node.querySelector("#chip-badges").children.length;
                if (!Yname||!Messages_EL||may) return;
                const Tname = node.querySelector("#author-photo").querySelector("#img");
                if (/(data\:image\/gif)+.*/.test(Tname.src))return
                let Tname_=Yname.innerText;
                let Cdk = Messages_EL.innerText.trim();
                if(checkname)Cdk = (Tname_.length>Key_l&&Cdk.length<Key_l)?Tname_:Cdk
                if(!Iroha(Cdk,node.offsetHeight)){Ch_m += 1;return};
                if (node.querySelector("#card") || node.querySelector(".member")) return;
                let Tname_T = node.data.authorExternalChannelId
                if (Blocked.includes(Tname_T))return
                let Key_On = false,Peko = false,Ischeck = false,IsSp = false;
                let get_time =new Date().getSeconds();
                Peko = Anemati.includes(Tname_T);
                if (!Peko){
                    Keylist.length&&Keylist.some((item)=>{
                        if (item==Cdk){
                            Key_On = true
                            IsSp = true
                        }
                        return Key_On;
                    })
                    !Key_On&&Node_List.some((item)=>{
                        if (item.Message==Cdk){
                            Key_On = true
                            if(item.Isspam===false){
                                Ischeck = true
                            }else if(item.Isspam===true){
                                IsSp = true
                            }
                        }
                        return Key_On;
                    })
                }
                if(Ischeck)return;
                let url = "https://www.youtube.com/channel/"+Tname_T,params_ = node.data.contextMenuEndpoint.liveChatItemContextMenuEndpoint.params
                Node_List.push({
                    node:node,name:Tname_,name_src:Tname_T,index:Node_List_index,Isblock:false,Isspam:null,
                    regexp:GetKey(Cdk),Message:Cdk,Time:get_time,interval:Ch_m,act:null,dubious:false,Repeat:false,URL:url,
                    params:params_
                });
                if(Ame){
                    let zoo = document.createElement("span");
                    zoo.id = "ZOO";zoo.innerHTML = Zoo();
                    Messages_EL.style.visibility = "hidden";Messages_EL.before(zoo);
                }
                if(Runing_M&&del_all){
                    Node_List[Node_List_index].act = "Delete";
                    Queue(node,Node_List_index);
                }else{
                    if (Key_On) {
                        if (IsSp){
                            Node_List[Node_List_index].act ="Block";Node_List[Node_List_index].Isspam = true;Node_List[Node_List_index].Isblock = true;
                            Node_List[Node_List_index].act =="Block"&&Blocked.push(Node_List[Node_List_index].name_src)
                            Spam++
                            Queue(node,Node_List_index)
                        }else{
                            Node_List[Node_List_index].dubious = true
                            Untreated++
                            Ollie==null&&Getmes()
                        }
                    }else if(Peko){
                        Node_List[Node_List_index].Isspam =true
                        let end = Node_List.some((item)=>{
                            return (item.name_src == Tname_T&&item.Isblock)
                        })
                        if (!Runing_M&&!Runing_N){
                            Node_List[Node_List_index].act =IsMod?"Delete":"Report"
                            if(Kirara&&!end){
                                Node_List[Node_List_index].act = "Block";Node_List[Node_List_index].Isblock = true
                            }
                        }else if((Runing_M||Runing_N)&&!end){
                            Node_List[Node_List_index].act ="Block";Node_List[Node_List_index].Isblock = true
                        }
                        Node_List[Node_List_index].act =="Block"&&Blocked.push(Node_List[Node_List_index].name_src)
                        Spam++
                        Queue(node,Node_List_index)
                    }else{
                        let a=Node_List.length-1,b=a-BBQ-1,Iscar=0
                        for(let i=a,c=b<0?0:b;i>=c;i--){
                            if(Node_List[i].name_src==Tname_T&&Node_List[i].interval<=1) Iscar++
                        }
                        if (Iscar>=BBQ){
                            Node_List.forEach((mes)=>{
                                if (Node_List[Node_List_index].name_src == mes.name_src&&!mes.Isblock){
                                    mes.Isspam =true
                                    Spam++
                                    if(Runing_M||Runing_N||Kirara){
                                        mes.Isblock = true
                                    }else{
                                        mes.act =IsMod?"Delete":"Report"
                                        Queue(mes.node,mes.index)
                                    }
                                }
                            })
                            if(Runing_M||Runing_N||Kirara){
                                Node_List[Node_List_index].act = "Block"
                                Node_List[Node_List_index].act == "Block"&&Blocked.push(Node_List[Node_List_index].name_src)
                                Queue(node,Node_List_index)
                            }
                            Node_List[Node_List_index].act!="Block"&&Anemati.push(Node_List[Node_List_index].name_src)
                        }else{
                            Untreated++
                            Ollie==null&&Getmes()
                        }
                    }
                }
                Ch_m=0;Node_List_index++
                shion_p.innerText= "Spam:"+Spam+"  |Normal:"+ Normal + "  |Untreated:"+ Untreated
                Untreated_.value =Untreated+ "  " + language_("Untreated", "未处理", "未処理")
            });
        });
    });
    Yagoo.observe(Itemslist, {
        childList: true,
    });
    let ISblock=document.getElementById("ISblock")
    let ISreplace=document.getElementById("ISreplace")
    let IScheckname = document.getElementById("IScheckname")
    let LogShow=document.querySelector("#Log_Show")
    let Dump = document.querySelector("#Dump")
    let Coco=document.getElementById("antetype_mes");
    let PRO_1 =document.getElementById("PRO_1")
    let AllLog=document.querySelector("#AllLog")
    let TOPdiv=document.getElementById("TOPdiv")
    let Del_all = document.getElementById("del_a")
    let Report_Menu_Fram,Dialogs_Confirm_Fram,Main_Menu_Fram,wi=MainWindow.clientWidth
    AllLog.before(date)
    AllLog.style.visibility = "hidden"
    Kirara = ISblock.checked
    Ame = ISreplace.checked
    Isauto()
    Menu_Set()
    function Menu_Set() {
        let F=document.querySelector("div#input-panel")
        let FF = new MutationObserver((node) =>Isauto())
        FF.observe(F, {
            childList: true,
        })
        let Menu_black = new MutationObserver((node) => {
            for (let item of node){
                for (let op of item.addedNodes){
                    if (op.nodeName=="TP-YT-IRON-OVERLAY-BACKDROP")op.style.display="none"
                }
            }
        });
        Menu_black.observe(document.querySelector("body"), {childList: true,});
        let Mumei =document.querySelector("yt-live-chat-app")
        let Menu_Set = new MutationObserver((node) => {
            for (let item of node){
                for (let op of item.addedNodes){
                    switch (op?.children[0]?.nodeName)
                    {
                        case "YT-REPORT-FORM-MODAL-RENDERER":
                            Report_Menu.disconnect();
                            Report_Menu.observe(op,{attributeFilter:[ "style"],})
                            Report_Menu_report=op.querySelector("#submit-button")
                            Report_Menu_Item=op.querySelector(".radio.style-scope.yt-options-renderer")
                            Report_Menu_Fram = op
                            break;
                        case "YT-CONFIRM-DIALOG-RENDERER":
                            Dialogs.disconnect();
                            Dialogs.observe(op,{attributeFilter:[ "style"],});
                            Dialogs_Confirm=op.querySelector("#confirm-button")
                            Dialogs_Confirm_Fram = op
                            break;
                        case "DIV":
                            if(op?.children[0].children[0].nodeName!="YTD-MENU-POPUP-RENDERER") return
                            Main_Menu.disconnect();
                            Main_Menu.observe(op,{attributeFilter:[ "style"],});
                            Main_Menu_Box = op.querySelector("#items").children
                            Main_Menu_Fram = op
                    }
                }
            }
            if(Report_Menu_Fram&&Dialogs_Confirm_Fram&&Main_Menu_Fram)Menu_Set.disconnect()
        });
        Menu_Set.observe(Mumei, {
            childList: true,
        });
        let Main_Menu = new MutationObserver((E) => {
            if (Achan===null||Main_Menu_Fram.style.display=="none")return
            Main_Menu_Fram.style.display = "none"
            let Main_Menu_Click,BoxLength=Main_Menu_Box.length,MSG = Del_List.length
            switch (Node_List[Achan].act){
                case "Report":
                    Main_Menu_Click = BoxLength=2?Main_Menu_Box[0]:Main_Menu_Box[1]
                    Main_Menu_Click&&Main_Menu_Click.children[0].children[0].click();
                    break;
                case "Delete":
                    BoxLength==5?Main_Menu_Click = Main_Menu_Box[2]:null
                    Mes(language_("Comment deleted","已删除评论","コメントが削除されました "),Node_List[Achan].act)
                    clearTimeout(Deleting);Deleting = null;Achan = null;FubuKing = false;
                    Main_Menu_Click&&Main_Menu_Click.children[0].children[0].click();
                    miko.innerText = stop?"Pausing："+MSG:MSG;
                    MSG?Queue():Mio=false;
                    break;
                case "Block":
                    IsMod?Main_Menu_Click = BoxLength ==4? Main_Menu_Box[3]: Main_Menu_Box[4]:Main_Menu_Click = Main_Menu_Box[1]
                    BlockText=Main_Menu_Click.querySelector("yt-formatted-string").childNodes[0].nodeValue
                    if (BlorUn == null)BlorUn = BlockText
                    if(BlorUn==BlockText&&IsMod){
                        Mes(language_("User has been blocked","用户已屏蔽","ユーザーがブロックされました"),Node_List[Achan].act)
                        miko.innerText = stop?"Pausing："+MSG:MSG;
                        clearTimeout(Deleting);Deleting = null;Achan = null;FubuKing = false;spam_co++;
                        rami_1.innerText = spam_co;
                        Main_Menu_Click&&Main_Menu_Click.children[0].children[0].click()
                        MSG?Queue():Mio=false;
                    }else if(BlorUn==BlockText&&!IsMod){
                        Main_Menu_Click&&Main_Menu_Click.children[0].children[0].click()
                    }else{
                        Node_List.forEach((item)=>{
                            if(item.name_src == Node_List[Achan].name_src)item.Repeat = true
                        })
                        clearTimeout(Deleting);Deleting = null;Achan = null;FubuKing = false;
                        Repeat++
                        miko.innerText = stop?"Pausing："+MSG:MSG;
                        Itemslist.click()
                        MSG?Queue():Mio=false;
                    }
                    break;
                case "Unblock":
                    IsMod?Main_Menu_Click = BoxLength ==4? Main_Menu_Box[3]: Main_Menu_Box[4]:Main_Menu_Click = Main_Menu_Box[1]
                    BlockText=Main_Menu_Click.querySelector("yt-formatted-string").childNodes[0].nodeValue
                    miko.innerText = stop?"Pausing："+MSG:MSG;
                    if (BlorUn!=BlockText){
                        Mes(language_("Unblocked","已解除屏蔽","ユーザーのブロックが解除した"))
                        spam_co--
                        Blocked.splice(Blocked.lastIndexOf(Node_List[Achan].name_src),1)
                        Main_Menu_Click&&Main_Menu_Click.children[0].children[0].click()
                    }else{
                        Itemslist.click()
                        Repeat++
                        Node_List.forEach((item)=>{
                            if(item.name_src == Node_List[Achan].name_src)item.Repeat = true
                        })
                    }
                    clearTimeout(Deleting);Deleting = null;Achan = null;FubuKing = false;
                    rami_1.innerText = spam_co
                    YuBi = 0
                    MSG?Queue():Mio=false;
            }
        });
        let Dialogs = new MutationObserver((E) => {
            if (Dialogs_Confirm_Fram.style.display=="none")return
            Dialogs_Confirm_Fram.style.display="none"
            let MSG = Del_List.length
            if (Achan!=null){
                switch (Node_List[Achan].act){
                    case "Report":
                        Mes(language_("Comment has been reported","已举报评论","コメントが報告されました"),Node_List[Achan].act)
                        spam_ro++
                        break;
                    case "Block":
                        spam_co++
                        YuBi = 0
                        Mes(language_("User has been blocked","用户已屏蔽","ユーザーがブロックされました"),Node_List[Achan].act)
                }
            }
            clearTimeout(Deleting);Deleting = null;Achan = null;FubuKing = false;
            rami_1.innerText = Kirara?spam_co:spam_ro
            miko.innerText = stop?"Pausing："+MSG:MSG;
            Dialogs_Confirm.children[0].children[0].click();
            MSG?Queue():Mio=false;
        });
        let Report_Menu = new MutationObserver((E) => {
            if (Report_Menu_Fram.style.display=="none")return
            Report_Menu_Fram.style.display="none"
            Report_Menu_Item.click();
            Report_Menu_Item.setAttribute('class', 'radio style-scope yt-options-renderer iron-selected')
            Report_Menu_Item.setAttribute('aria-checked', 'true')
            Report_Menu_Item.setAttribute('aria-selected', 'true')
            Report_Menu_Item.setAttribute('checked', '')
            Report_Menu_Item.setAttribute('active', '')
            Report_Menu_Item.setAttribute('focused', '')
            Report_Menu_report.click();
        });
    }
    function DellArray(V,Array){
        let Fubigi = [];
        for (let i= Array.length-1;i>=0;i--){
            if(Array[i]==V){
                Array.splice(i, 1)
            }
        }
        Array = Array.filter((item)=>{
            let Na=Fubigi.includes(item.proto)
            !Na&&Fubigi.push(item)
            return !Na
        })
        return Array
    }
    function Sorting(a,b){
        let LogNames = []
        b = b.filter((item)=>{
            return !item.Repeat
        })
        let Xx = b.filter((item)=>{
            let Na = true
            Na=LogNames.includes(item.name_src)
            !Na&&LogNames.push(item.name_src)
            return !Na
        })
        return Xx
    }
    function GetKey(mes) {
        let re = /[\u4e00-\u9fa5]{2,8}|[\u30A0-\u30FF]{2,}/g
        let ree =mes.match(re)
        let leng = ree?ree.length:0
        let items=""
        if (leng>1){
            ree.forEach((item)=>{
                items += item+".*"
            })
            items = ".*"+ items
        }else{
            let re_en = /\b[A-Z]+\w{2,}-*[A-Za-z]*\b/g
            let ree = mes.match(re_en)
            let leng = ree?ree.length:0
            let i = Math.floor(Math.random()*leng)
            items = leng>1?ree[i]:"nullll"
        }
        return items
    }
    pro.style.width=wi+"px";pro.setAttribute('class', 'pro')
    TOPdiv.onclick=(e)=>{
        let GTA,LogNames = [],index,AutoR,item,Ischeckname;
        switch (e.target.id)
        {
            case "Set_off":
                TOPdiv.style.visibility="hidden";AllLog.style.visibility = "hidden";Del_all.style.visibility = "hidden";Inverse.style.visibility = "hidden";
                Category.disabled = false;Category.selectedIndex=0;Category.options[2].style.display = "none";
                IsUntreated=false
                Untreated_.value =Untreated+ "  " + language_("Untreated", "未处理", "未処理")
                BlockLogs.innerHTML=null
                LogShow.checked =false
                Selection = true
                !FubuKing&&Koyori(false)
                Towa()
                break;
            case "ISblock":
                AutoR=document.querySelector("#auto___")
                Isblock = ISblock.checked?"checked":" "
                Kirara=ISblock.checked
                localStorage.setItem("IsBlock",Isblock)
                rami_1.innerText = Kirara?spam_co:spam_ro
                Kirara?DellMes.value = language_("Block","屏蔽","ブロック") :DellMes.value = IsMod?language_("Delete","删除","削除"):language_("Report","举报","報告")
                break;
            case "ISreplace":
                Isreplace = ISreplace.checked?"checked":" "
                Ame=ISreplace.checked
                localStorage.setItem("Isreplace",Isreplace)
                break;
            case "IScheckname":
                Ischeckname = IScheckname.checked?"checked":" "
                checkname = IScheckname.checked
                localStorage.setItem("IScheckname",Ischeckname)
                break;
            case "Log_Show":
                Del_all.style.visibility = "hidden";Inverse.style.visibility = "hidden"
                Selection = true
                Node_Log_List = Node_List.filter((item)=>{
                    return (item.Isspam&&!item.Isblock)
                })
                Node_Log_List = Sorting(Node_List,Node_Log_List)
                Gura =LogShow.checked
                All_Block.style.display = ""
                if(!Gura){
                    BlockLogs.innerHTML=null
                    IsUntreated=false
                    AllLog.style.visibility = "hidden"
                    Category.selectedIndex=0;Category.disabled = false;Category.options[2].style.display = "none";
                    Towa()
                    Koyori(true)
                    return
                }
                !FubuKing&&Koyori(false)
                date.innerHTML = ""
                BlockLogs.style.height = "414px"
                AllLog.style.visibility = "visible"
                PageMode = doc;pages=doc;Page=0;PageN = 1
                page_.value = PageN
                sort(false,"name",Node_Log_List)
                Log_List(Node_Log_List,Page,pages,"name")
                BlockLogs.scrollTop=BlockLogs.scrollHeight
                break;
            case "IS__Block":
                if (!Selection) return
                index=e.target._id_*1||e.target.parentNode.id*1
                item = e.target.parentNode.previousElementSibling.parentNode.parentNode
                GTA=Node_List[index]
                if(!GTA.Isblock){
                    for(let i=0,l = e.target._items_.length;i<l;i++){
                        let indexx = e.target._items_[i].index*1
                        Node_List[indexx].Isspam=true;Node_List[indexx].Isblock =true;
                        Node_List[indexx].regexp!="nullll"&&Key.push(Node_List[indexx].regexp)
                    }
                    GTA.act = "Block"
                }else{
                    for(let i=0,l = e.target._items_.length;i<l;i++){
                        let indexx = e.target._items_[i].index*1
                        Node_List[indexx].Isspam = null;Node_List[indexx].Isblock = false;
                    }
                    let del = Anemati.lastIndexOf(GTA.name_src)
                    Anemati.splice(del,1)
                    GTA.act = "Unblock"
                }
                item.style.opacity=GTA.Isblock?0.3:1
                e.target.disabled = GTA.Isblock?true:false
                shion_p.innerText=count()
                Untreated_.value = Untreated+ "  " + language_("Untreated", "未处理", "未処理")
                GTA.act =="Block"&&Blocked.push(GTA.name_src)
                Queue(GTA.node,index)
                break;
            case "All_Block":
                Selection = Selection?false:true;
                All_Block.value = Selection?language_("Single","单选","一択"):language_("Multiple","多选","多肢選択")
                Del_all.style.visibility =Selection?"hidden":"visible"
                Inverse.style.visibility =Selection?"hidden":"visible"
                for(let i=0,l = BlockLogs.children.length;i<l;i++){
                    let box = BlockLogs.children[i].querySelector("#IS__Block")
                    box.checked = Selection?false:true
                }
                break;
            case "del_a":
                for(let i=0,l = BlockLogs.children.length;i<l;i++){
                    let item = BlockLogs.children[i],box = item.querySelector("#IS__Block"),index = box._id_*1
                    console.log(index)
                    if(box.checked){
                        for(let i=0,l = box._items_.length;i<l;i++){
                            let indexx = box._items_[i].index*1
                            Node_List[indexx].Isspam=true;Node_List[indexx].Isblock =true;
                            Node_List[indexx].regexp!="nullll"&&Key.push(Node_List[indexx].regexp)
                        }
                        Node_List[index].act = "Block"
                        Node_List[index].act =="Block"&&Blocked.push(Node_List[index].name_src)
                        Queue(Node_List[index].node,index)
                    }else{
                        for(let i=0,l = box._items_.length;i<l;i++){
                            let indexx = box._items_[i].index*1
                            Node_List[indexx].Isspam　=　false;Node_List[indexx].Isblock =　false;
                        }
                    }
                }
                if (IsUntreated){
                    Node_Log_List = Node_List.filter((item)=>{
                        return item.Isspam===null
                    })
                    Node_Log_List = Sorting(Node_List,Node_Log_List)
                }else{
                    Node_Log_List = Node_List.filter((item)=>{
                        return item.Isspam&&!item.Isspam
                    })
                    Node_Log_List = Sorting(Node_List,Node_Log_List)
                }
                shion_p.innerText=count()
                Untreated_.value = Untreated+ "  " + language_("Untreated", "未处理", "未処理")
                All_Block.style.display = ""
                page_.value = 1
                Page= 0;pages=doc;PageN = 1
                Log_List(Node_Log_List,Page,pages,"name",false)
                BlockLogs.scrollTop=BlockLogs.scrollHeight
                break;
            case "Inverse":
                for(let i=0,l = BlockLogs.children.length;i<l;i++){
                    let item = BlockLogs.children[i],box = item.querySelector("#IS__Block")
                    box.checked = box.checked?false:true
                }
        }
    }
    TOPdiv.ondblclick = (e) =>{
        switch (e.target.id)
        {
            case "Log_Name":
                window.open("https://www.youtube.com/channel/"+e.target.parentNode.id+"/about")
        }
    }
    function Mes(mes,dodo){
        switch (dodo){
            case "Report":
                PRO_1.style.background = "rgba(222, 253, 7, 0.5)"
                break;
            case "Delete":
                PRO_1.style.background = "rgba(222, 253, 7, 0.5)"
                break;
            case "Block":
                PRO_1.style.background = "rgba(255, 0, 0, 0.5)"
                break;
            case "Unblock":
                PRO_1.style.background = "rgba(0, 255, 52, 0.5)"
                break;
            case "skip":
                PRO_1.style.background = "rgba(0, 255, 52, 0.5)"
                break;
            default:
                PRO_1.style.color = "#93d2ff"
                PRO_1.style.background = "rgba(75,75,75,0.7)"
        }
        pro.style.display = ""
        PRO_1.innerHTML = mes
        clearTimeout(prpr)
        prpr=setTimeout(()=>{
            pro.style.display = "none"
            prpr=null
        },500)
    }
    Category.onblur = ()=>!FubuKing&&Koyori(false);
    Category.onfocus = ()=> Koyori(true);
    Category.onclick = ()=>{
        if (This ===Category.selectedIndex&&This!=null){
            Category.blur()
            This=null
        }else{
            This = Category.selectedIndex
        }
    }
    Category.onchange=()=>{
        BlockLogs.style.height = "414px";BlockLogs.innerHTML=null;
        PageMode = doc;pages=doc;Page=0;PageN = 1
        let Selector = document.querySelector("#Category_sort").value
        if(Selector == "URL_"){
            All_Block.style.display = "none"
            let URL_Textarea = document.createElement("textarea"),yooooo=[]
            URL_Textarea.setAttribute("readOnly", true);
            for (let i=0,l=Node_List.length;i<l;i++){
                if(Node_List[i].URL&&(Node_List[i].Isblock))yooooo.push(Node_List[i].URL);
            }
            yooooo=[...new Set(yooooo)]
            URL_Textarea.placeholder = language_("Get only the channel URL of blocked user","只获取已屏蔽的用户的频道网址","ブロックされたユーザーのチャネルURLのみ");
            URL_Textarea.value = yooooo.join("\n")
            BlockLogs.appendChild(URL_Textarea)
        }else if(Selector == "Blocked"){
            All_Block.style.display = "none";Del_all.style.visibility ="hidden";Inverse.style.visibility = "hidden";
            Node_Log_List = Node_List.filter((item)=>{
                return item.Isblock
            })
            Node_Log_List = Sorting(Node_List,Node_Log_List)
            sort(false,"Mes_length",Node_Log_List)
            Log_List(Node_Log_List,Page,pages,"name")
        }else{
            All_Block.style.display = ""
            Node_Log_List = Node_List.filter((item)=>{
                return item.Isspam&&!item.Isblock
            })
            Node_Log_List = Sorting(Node_List,Node_Log_List)
            sort(false,"Mes_length",Node_Log_List)
            Log_List(Node_Log_List,Page,pages,"name")
        }
        page_.value = 1
        BlockLogs.scrollTop=BlockLogs.scrollHeight
        Category.blur()
        setTimeout(()=>{This = null},100)
    }
    function Property(a,b,c){
        Object.defineProperty(a, b, {
            value: c,
        });
    }
    function Log_List(Log_ty,Page,pages,Name){
        BlockLogs.innerHTML=null
        let Fragment = document.createDocumentFragment(),BB=0
        YMD = Log_ty;
        Pageleng = Log_ty.length
        for(let i = Page;i<pages;i++){
            if(!Log_ty[i])break;
            let div = Coco.cloneNode(true),list = [];
            div.querySelector("#antetype").parentNode.id = Log_ty[i].name_src
            div.querySelector("#antetype").id= Log_ty[i].index
            div.style.backgroundColor=BB%2==0?WTF_1:WTF_2
            list = Node_List.filter((item)=>{
                return item.name_src == Log_ty[i].name_src
            })
            list.forEach((mes)=>{
                let mes_log_div = document.createElement("div");
                mes_log_div.innerText = mes.Message;mes_log_div.id = mes.index
                div.querySelector("#mes_log").appendChild(mes_log_div)
            })
            let logn=div.querySelector("#Log_Name")
            logn.innerText = Log_ty[i].name;
            logn.title = language_("Double click to enter channel","双击进入频道","ダブルクリックしてチャンネルに入る")
            logn.style.cursor = "pointer";logn.style.userSelect = "none";
            let input =div.querySelector("#Unblock")
            input.title = language_("Unblock or block users","解除或屏蔽用户","ユーザーのブロックを解除またはブロックする")
            input.id="IS__Block"
            Property(input,"_items_",list)
            Property(input,"_id_",Log_ty[i].index)
            if(Log_ty[i].Isblock)input.setAttribute('checked', '');
            div.style.display = "";
            BB++
            Fragment.appendChild(div)
        }
        shion_p.innerText=count()
        Untreated_.value =Untreated+ "  " + language_("Untreated", "未处理", "未処理")
        BlockLogs.appendChild(Fragment)
        max_.value = "Max:"+ Math.ceil(Pageleng/PageMode)
        BlockLogs.scrollTop=BlockLogs.scrollHeight
        Selection = true
        All_Block.value = language_("Single","单选","一択")
    }
    function count(){
        Untreated = 0;Spam = 0; Normal = 0
        for (let i =0,L=Node_List.length;i<L;i++ ){
            if(Node_List[i].Repeat)continue;
            if (Node_List[i].Isspam ==null){
                Untreated++
                continue
            }else{
                Node_List[i].Isspam?Spam++:Normal++
            }
        }
        return "Spam:"+Spam+"  |Normal:"+ Normal + "  |Untreated:"+ Untreated
    }
    function sort(Sort,type,arr){
        arr.sort((a,b)=>{
            let x, y
            switch (type)
            {
                case "name":
                    x = a.name.length;y = b.name.length;
                    break
                case "Mes_length":
                    x = a.Message.length;y = b.Message.length;
                    break
                case "name_abc":
                    x = a.name.toLowerCase();y = b.name.toLowerCase();
                    break
                case "Ii":
                    x = a.index;y = b.index;
                    break
                case "Key_Ii":
                    x = a.length;y = b.length;
            }
            if (x < y) return Sort?-1:1
            if (x > y) return Sort?1:-1
            return 0;
        })
    }
    function Set_(){
        let wi=window.innerWidth,hi=window.innerHeight-169;
        TOPdiv.style.width=wi+"px";TOPdiv.style.height=hi+"px";TOPdiv.style.visibility = "visible"
    }
    function Zoo(){
        let zoo=["にゃん","モグ","ワン","パチ","ピカ","ガオ"]
        let i=Math.floor(Math.random()*6)
        let b=zoo[i]+zoo[i]
        for(let n=0;n<=Math.floor(Math.random()*2);n++){
            b+=zoo[i]
        }
        return b
    }
    function Queue(mes,index){
        if(mes){
            Del_List.unshift({node:mes,index:index});
            sort(false,"Ii",Del_List)
            miko.innerText = stop?"Pausing："+Del_List.length:Del_List.length;
            if(!Mio)Queue();
        }else{
            miko.innerText = stop?"Pausing："+Del_List.length:Del_List.length;
            if(stop){
                shion_p.innerText=count();
                return;
            }
            Delet_mes = Del_List.shift();
            Achan = Delet_mes.index*1;
            shion_p.innerText = count();
            Mio=true;FubuKing = true;DellMes.disabled = true;GetNewMes.disabled = true;
            if(!document.body.contains(Node_List[Achan].node)){
                Dump.innerHTML = "";Dump.appendChild(Node_List[Achan].node);
            }
            setTimeout(()=>Delet_mes.node.querySelector("#button.yt-icon-button").click(),600)
            Deleting = setTimeout(()=>{
                FubuKing = false;DellMes.disabled = false;GetNewMes.disabled = false;Mio = false;
                let ML = Del_List.length;
                miko.innerText = stop?"Pausing："+ML:ML;
                if (YuBi>2){
                    clearTimeout(Deleting);Deleting = null;Achan = null;YuBi = 0;
                    return
                }
                err++
                Node_List[Achan].act = Node_List[Achan].act == "Unblock"?"Unblock":"Block"
                if (Node_List[Achan].act =="Block"){
                    Node_List[Achan].Isblock=true
                    Node_List.forEach((mes)=>{
                        if (Node_List[Achan].name_src == mes.name_src){
                            mes.Isblock = true;mes.Isspam =true;mes.regexp!="nullll"&&Key.push(mes.regexp)
                        }
                    })
                }
                YuBi++
                Queue(Node_List[Achan].node,Node_List[Achan].index)
            },Delete_interval+600)
        }
    }
    function Isauto(){
        let self= document.querySelector("div#top")?.querySelector("yt-live-chat-author-chip")
        if(!self)return
        my = self?.querySelector("#chat-badges")
        my.title = language_("Automatic Block","自动屏蔽","自動ブロック")
        iv=document.querySelector("DIV#input")
        if(IsMod&&my){
            const gauging_120 = document.createElement("div");
            gauging_120.style.display = "inline-block";gauging_120.id = "D_D";gauging_120.style.visibility = "hidden";
            gauging_120.innerText = language_("Delete Directly","直接删除","直接削除");
            const gauging_dell = document.createElement("input");
            gauging_dell.setAttribute("type","checkbox");gauging_dell.id = "ALL_Del"
            gauging_120.appendChild(gauging_dell);
            self.appendChild(gauging_120)
            my.style.cursor = "pointer";my.querySelector("div#image").style.color=Runing_M?"aqua":""
            gauging_120.style.visibility = Runing_M?"visible":"hidden"
            gauging_dell.checked = del_all;
            my.onclick = (e)=>{
                Runing_M=Runing_M?false:true
                my.querySelector("div#image").style.color=Runing_M?"aqua":""
                gauging_120.style.visibility = Runing_M?"visible":"hidden";
                del_all = false; gauging_dell.checked = del_all;
            }
            gauging_dell.onclick = (e)=>{
                del_all = gauging_dell.checked;
            }
        }else{
            AutoR = document.createElement("div");AutoR.style.cursor = "pointer";AutoR.id = "auto___";
            AutoR.innerText = "☑";AutoR.style.fontSize = "16px";AutoR.style.userSelect="none";AutoR.style.color=Runing_N?"aqua":"";
            self.appendChild(AutoR)
            AutoR.onclick = ()=>{
                Runing_N=Runing_N?false:true
                AutoR.style.color=Runing_N?"aqua":""
            }
            AutoR.title = language_("Automatic Block","自动屏蔽","自動ブロック")
        }
        if(iv){
            if(iv)iv.title = language_("⁂Record only comments sent via the send button\narrow key↑:Show originally sent comment\narrow key↓:Show last sent comment","⁂仅记录通过发送按钮发送的评论\n方向键↑:显示最初发送的评论\n方向键↓:显示最后发送的评论","⁂送信ボタンから送信されたコメントのみをログに記録する\n矢印キー↑:送信された最初のコメントを表示\n矢印キー↓:送信された最後のコメントを表示")
            iv.addEventListener('compositionstart', (event) => {
                Isiput = true
            });
            iv.addEventListener('compositionend', (event) => {
                Isiput = false
            });
            iv.onfocus = ()=> Koyori(true)
            iv.onblur = ()=> {!FubuKing&&Koyori(false)}
            iv.oninput=()=>{
                if (Isiput)return
                let tex=iv.cloneNode(true)
                let isnull = !(tex.innerHTML=="<br>"||tex.innerHTML=='<br class="style-scope yt-live-chat-text-input-field-renderer">')
                if (rami>-1){
                    if(isnull){
                        Comment[rami] = tex.innerHTML
                    }else{
                        Comment.splice(rami,1)
                        rami=-1
                    }
                }else{
                    isnull&&Tex.pop()
                    isnull&&Tex.unshift(tex)
                }
            }
            New_Chat_Frame.onclick = (e)=>{
                if(e.target.nodeName=="IMG"&&(e.target.parentNode.id=="emoji"||e.target.parentNode.id=="variants")){
                    let tex=iv.cloneNode(true)
                    if (rami>-1){
                        Comment[rami] = tex.innerHTML
                    }else{
                        Tex.pop()
                        Tex.unshift(tex)
                    }
                }else if (e.target.nodeName =="YT-ICON"&&e.target.parentNode.id=="button"){
                    if (rami>-1){
                        rami = -1
                        return
                    }
                    Tex[0]&&Comment.push(Tex[0].innerHTML)
                    Tex = []
                    Comment=[...new Set(Comment)]
                    rami = -1
                }
            }
        }
        if(!(document.body.contains(Itemslist))){
            Yagoo.disconnect()
            Itemslist = document.querySelector("#items.yt-live-chat-item-list-renderer");
            Yagoo.observe(Itemslist, {
                childList: true,
            })
        }
    }
    const nullll = GM_registerMenuCommand("┏━━━━━━━━━━━━━━━━━━━━┓", () => {
    });
    const rere = GM_registerMenuCommand(language_("Enable/disable automatic operation under playback video","开启/关闭录播的自动操作","動画再生時の自動操作の有効化/無効化"), () => {
        IsMod?Runing_M=Runing_M?false:true:Runing_N=Runing_N?false:true
        if(Runing_M||Runing_N){alert("On")}else{alert("Off")}
    });
    const nullll11 = GM_registerMenuCommand("┗━━━━━━━━━━━━━━━━━━━━┛", () => {
    });
    function call(none){
        let iv=document.querySelector("DIV#input")
        if (!iv) return
        iv.parentNode.setAttribute('focused', '')
        let ie= new InputEvent("input")
        iv.innerHTML= none;iv.dispatchEvent(ie);
        document.querySelector("yt-button-renderer.yt-live-chat-message-input-renderer").click()
        iv.innerHTML = null
    }
    function Koyori(is){
        stop = is
        if(stop){
            if(FubuKing){
                DellMes.disabled = true;GetNewMes.disabled = true
            }else{
                DellMes.disabled = false;GetNewMes.disabled = false
            }
            miko.innerText = "Pausing："+Del_List.length
        }else{
            let ML = Del_List.length
            DellMes.disabled = true;GetNewMes.disabled = true;
            miko.innerText = stop?"Pausing："+ML:ML
            ML?Queue():Mio=false;
        }
    }
    (function Translation(){
        sc=window.parent.document.getElementById("sc-translator-shadow")||document.getElementById("sc-translator-shadow")
        if (sc){
            let EliteMiko=sc.shadowRoot.childNodes[4].querySelector(".st-result")
            let scc = new MutationObserver((node) => {
                node.forEach((me)=>{
                    me.addedNodes.forEach((you)=>{
                        if (you?.children?.length==1&&you?.children[0].nodeName=="SPAN"){
                            let selection = window.getSelection ? window.getSelection() : window.document.getSelection();
                            let messs=selection.focusNode
                            messs.data=you.innerText
                        }
                    })
                })
            });
            scc.disconnect();
            scc.observe(EliteMiko,{
                childList: true
            });
        }
    })()
    function Add_URL_List (){
        let URL_list=[],show,SetList,wait
        let yagoo=document.querySelector("#html-body"),map,map2,destination
        let Menu_Set = new MutationObserver((E) => {
            if(E[0]?.addedNodes[0]?.nodeName =="YTCP-CHANNEL-SETTINGS-DIALOG"){
                let allblock=E[0]?.addedNodes[0]
                map = allblock.children[0].children[0].children[0].children[1]
                show=allblock.querySelector("h1#dialog-title")
                Menu_Set.disconnect()
                Menu_Map.observe(map,{childList: true})
            }
        });
        yagoo&&Menu_Set.observe(yagoo,{childList: true})
        let Menu_Map = new MutationObserver((E) => {
            if (E[0]?.addedNodes[0].nodeName =="YTCP-NAVIGATION"){
                map2 = E[0]?.addedNodes[0]
                Menu_Map.disconnect()
                Menu_Map2.observe(map2,{childList: true,subtree:true})
            }
        });
        let Menu_Map2 = new MutationObserver((item) => {
            item.forEach((node)=>{
                node.addedNodes.forEach((no)=>{
                    if (no.nodeName =="YTCP-COMMUNITY-SETTINGS"){
                        destination=no
                        fun()
                        Menu_Map2.disconnect()
                    }
                })
            })
        });
        function Queue_(){
            SetList.value = URL_list.length-1
            let ul = URL_list.shift()
            WriteBlock(ul)
            wait=setTimeout(()=>{
                let pvp=document.querySelectorAll("#text-input")[2]
                pvp.innerText= ""
                pvp.value= ""
                URL_list.length&&Queue_()
            },2000)
        }
        function WriteBlock(url){
            let pvp=document.querySelectorAll("#text-input")[2]
            let ie= new InputEvent("input")
            pvp.innerText= url
            pvp.value= url
            pvp.dispatchEvent(ie);
            pvp.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.focus()
            let event = document.createEvent('Event')
            event = new KeyboardEvent('keyup',{keyCode: 13})
            pvp.focus()
            pvp.dispatchEvent(event)
        }
        const on = GM_registerMenuCommand(language_("Blacklist extension script","黑名单扩展脚本","ブラックリスト拡張スクリプト"), () => {
            destination&&fun()
        });
        function fun(){
            document.querySelectorAll("ytcp-channel-picker-form-container")[0].disabled=true
            document.querySelectorAll("ytcp-channel-picker-form-container")[0].style.display="none"
            document.querySelectorAll("ytcp-channel-picker-form-container")[1].disabled=true
            document.querySelectorAll("ytcp-channel-picker-form-container")[1].style.display="none"
            document.querySelectorAll("ytcp-channel-picker-form-container")[2].querySelector("#chip-bar-container-hint").innerHTML +=
                '<input id="SetList" type="button" value="Add" style="border: 0px;">'
            document.querySelectorAll("ytcp-channel-picker-form-container")[2].querySelector("#chip-bar-container-hint").parentNode.innerHTML +=
                '<div style="height: 150px;width: 600px;"><textarea id="URL_List" placeholder="'+
                language_("Channel URL ","频道网址","チャネルURL")
                +'" style="width: 600px;height: 150px;background: #000000fa;margin: 0px;border: 0px;color: #f5f5dcb5;"></textarea></div>'
            document.querySelector("#SetList").onclick=()=>{
                URL_list = document.querySelector("#URL_List").value.split('\n')
                Queue_()
            }
            SetList = document.querySelector("#SetList")
            let Yagoo=document.querySelectorAll("tp-yt-paper-listbox#channel-results-container")[2]
            let Menu_Set = new MutationObserver((E) => {
                if (E[0].addedNodes[0]&&E[0].addedNodes[0].tagName == "TP-YT-PAPER-ITEM"){
                    Yagoo.click()
                    Yagoo.children[0].click()
                }
            });
            Menu_Set.disconnect()
            Menu_Set.observe(Yagoo,{childList: true,})
        }
    }
})();
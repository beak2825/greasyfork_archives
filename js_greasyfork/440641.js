// ==UserScript==
// @name         06 Line Split Hack(beta)
// @namespace    https://www.youtube.com/channel/UCKtyj4gKoJqzsqo15MRiupw
// @version      1.0.23
// @description  Easy line split, Redo respawn, Make the chat text selectable, Copy the name,This is a script that works with gota.io's self-feed server.
// @author       06
// @match        *://gota.io/web*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440641/06%20Line%20Split%20Hack%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440641/06%20Line%20Split%20Hack%28beta%29.meta.js
// ==/UserScript==
var gotaMenu = document.getElementById("main")
var scorem = document.getElementById("score-mouse")
var advertisement = document.getElementById("preroll")
var ctex = document.getElementById("context-menu")
var kQuadSplit = document.getElementById("kQuadSplit").textContent;
var kDoubleSplit = document.getElementById("kDoubleSplit").textContent;
var kSplit = document.getElementById("kSplit").textContent;
var kTripleSplit = document.getElementById("kTripleSplit").textContent;
var kHexaSplit = document.getElementById("kHexaSplit").textContent;
var kFreezeMouse = document.getElementById("kFreezeMouse").textContent;//var sphversion = document.getElementById("sphversion").textContent;//var backgraundColor = document.getElementsByClassName("sp-input")//var playcel = document.getElementById("playerCells").textContent;
var mode = 0;
var vkaisuu = 0;
var linereset = 0;
var line_totyuu;
var sphversionThis = "ver 1.0"
var sphversionDecimalThis = ".23"
var keycode = new Object({
    0:48,1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57,
    A:65, B:66,C: 67,D: 68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P: 80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,
    SPACE:32, CONTROL:17, SHIFT:16, ALT:18, TAB:9, CAPS_LOCK:20, OS_KEY:91, CONTEXT_MENU:93, BACK_SPACE:8, MINUS:189, EQUALS:187, OPEN_BRACKET:219,
    ENTER:13, SEMICOLON:186, CLOSE_BRACKET:221, COMMA:188, PERIOD:190, SLASH:191, LEFT:37, UP:38, RIGHT:39, DOWN:40,
});
var modename = new Object({
    "A":"Nomal", "B":"Leeway", "C":"Stability", "D":"Low-Ping", "OFF":"OFF"
});
var splithackData_new = new Object({
    splitmode:"A", hidepanel:false, textselect:true, line8x:"Q", line16x:"A", modeswitch:"P", redorespawn:"B",sphversionStrage:sphversionThis
});

(function(){//                             ブロックをクローン
    var content_area = document.getElementById("score-panel");// 複製するHTML要素を取得
    var clone_element = content_area.cloneNode(true);// 複製
    while( clone_element.firstChild ){//子要素削除
        clone_element.removeChild( clone_element.firstChild );
    }
    $(clone_element). addClass("zerorokupanel");
    var newElement = document.createElement("p"); // p要素作成
    var newContent = document.createTextNode(""); // テキストノードを作成
    newElement.appendChild(newContent); // p要素にテキストノードを追加
    newElement.setAttribute("class","zerorokutitle"); // p要素にidを設定
    clone_element.insertBefore(newElement, clone_element.firstChild);// 追加
    $('div#party-panel.ui-pane.interface-color.hud-panel').before(clone_element);
    var content_area2 = document.getElementById("main-account");// 複製するHTML要素を取得
    var clone_element2 = content_area2.cloneNode(true);// 複製
    while( clone_element2.firstChild ){//子要素削除
        clone_element2.removeChild( clone_element2.firstChild );
    }
    var newElement2 = document.createElement("div"); // p要素作成
    var newContent2 = document.createTextNode(""); // テキストノードを作成
    newElement2.appendChild(newContent2); // p要素にテキストノードを追加
    newElement2.setAttribute("id","inner-06"); // p要素にidを設定
    clone_element2.setAttribute("id","main-06");
    clone_element2.setAttribute("style","z-index: 2; opacity: 0; display: flex; pointer-events: none;");
    clone_element2.insertBefore(newElement2, clone_element2.firstChild);// 追加
    $('div#main-account.main-panel').before(clone_element2);
    var content_area3 = document.getElementById("btn-options");// 複製するHTML要素を取得
    var clone_element3 = content_area3.cloneNode(true);// 複製
    while( clone_element3.firstChild ){//子要素削除
        clone_element3.removeChild( clone_element3.firstChild );
    }
    clone_element3.setAttribute("id","btn-06split");
    $('button#btn-cellpanel.gota-btn.bottom-btn').after(clone_element3);
    var content_area4 = document.getElementById("main-account");// 複製するHTML要素を取得
    var clone_element4 = content_area4.cloneNode(true);// 複製
    while( clone_element4.firstChild ){//子要素削除
        clone_element4.removeChild( clone_element4.firstChild );
    }
    var newElement4 = document.createElement("div"); // p要素作成
    var newContent4 = document.createTextNode(""); // テキストノードを作成
    newElement4.appendChild(newContent4); // p要素にテキストノードを追加
    newElement4.setAttribute("id","inner-06-2"); // p要素にidを設定
    clone_element4.setAttribute("id","main-06-2");
    clone_element4.setAttribute("style","display: flex; z-index: 2;");
    clone_element4.insertBefore(newElement4, clone_element4.firstChild);// 追加
    $('div#main-account.main-panel').before(clone_element4);

    scorem.setAttribute("style","display:none;");
}());//ブロックをクローン
(function(){//                      HTMLを記述
    $('p.zerorokutitle').after(`\
<p id = "pyousomodebtn" class = "pyousomodepanel">Mode: <span id = "modebtn" class = "modepanel">${modename["A"]}</span>\</p>
<p>Key: <span  class = "logkennsa">-</span><p>\
<p>Split: <span class = "printsplit">-</span><p>\
<p><span class = "infozeroroku"></span><p>\
<p class = "zerorokuer"></p>\
`);
    $('ul.context-list').append('<li id="menu-namecopy" class="context-action2" style="display: block;"><span>NameCopy</span></li>');
    $('button#btn-06split.gota-btn.bottom-btn').text('06 Settings');
    $('div#main-06.main-panel').prepend('<div class="title-text menu-title">06 Split Hack</div>');
    $('div#main-06-2.main-panel').prepend(`<div class="title-text menu-title">06 Split Hack ${sphversionThis}${sphversionDecimalThis}</div>`);
    $('div#inner-06-2').append(`
<p id = "main06exp" class = "main06exp">Welcome to 06 Split Hack! This script allows you to control MOUSE FROZEN to achieve Line Split easily at any time.</p>\
<p>Briefly, the program will unfreeze at 2x Split and 4x Split, and freeze at 16x Split. (It is actually a more complicated program.)</p>\
<p>4x→16x→Line Split😃</p>\
 <table class = "options-table main-06-table">\
    <tbody>\
<tr><td>\
<script src="https://apis.google.com/js/platform.js"></script>\
<div class="g-ytsubscribe" data-channelid="UCKtyj4gKoJqzsqo15MRiupw" data-layout="full" data-count="hidden"></div>\
</td>\
<td>\
</td>\
</tr>\
</tbody>\
</table>\
`);
    $('div#inner-06').append(
`<table class = "options-table">\
<thead><tr><th colspan="2">Options</th></tr></thead>\
<tbody>\
<tr><td colspan="1">Split Mode</td><td id ="splitmodebox"><select  class="options06" id="splitmode">\
<option value="A">${modename["A"]}</option>\
<option value="B">${modename["B"]}</option>\
<option value="C">${modename["C"]}</option>\
<option value="D">${modename["D"]}</option>\
<option value="OFF">${modename["OFF"]}</option>\
</select></td></tr>\
<tr><td colspan="1">Hide 06 Panel</td><td id ="hidesplitbox"><input type="checkbox" class="options06" id="cHide06Panel"></td></tr>\
<tr><td colspan="1">Enable Text Selection (Chat)</td><td id ="chatserectbox"><input type="checkbox" class="options06" id="chatselect"></td></tr>\
</tbody>\
<thead><tr><th colspan="2">keybinds</th></tr></thead>\
<tbody>\
<tr><td colspan="1">LineSplit (8x)</td><td id ="linesplitbox8x"><select  class="options06" id="linesplit8x"></select></td></tr>\
<tr><td colspan="1">LineSplit (16x)</td><td id ="linesplitbox16x"><select  class="options06" id="linesplit16x"></select></td></tr>\
<tr><td colspan="1">Switch Split Mode</td><td id ="switchsplitbox"><select  class="options06" id="switchsplit"></select></td></tr>\
<tr><td colspan="1">Redo Respawn (Hide ad)</td><td id ="redorespawnbox"><select  class="options06" id="redorespawn"></select></td></tr>\
</tbody>\
</table>\
<p id = "error-06"></p>`
    );
}());//HTMLを記述
(function(){//                                      スタイルを設定し読み込ませる
    const style = document.createElement('style')
    style.innerHTML = `
#score-panel {
    margin-bottom: 10px;
    display: table;
}
#party-panel {
     top: 0px;
}
  .zerorokutitle{
      font-size: 17px;
      padding-bottom: 2px;
      text-align: center;
      color: #FF00FF;
  }
  .context-action2:hover {
   background-color: #808080;   /* ボタンの表面色をちょっと明るく */
   /* border-color: #C0C0C0;       枠線の色もちょっと明るく */
}
#main-rb{
display: none;
}

#main-06 {
    display: flex;
    flex-direction: column;
    font-family: open sans;
    width: 350px;
    height: 300px;
    margin-bottom: 10px;
    transition: opacity 1s;
    position: absolute;
}
#main-06-2 {
    display: flex;
    flex-direction: column;
    font-family: open sans;
    width: 350px;
    height: 300px;
    margin-bottom: 10px;
    transition: opacity 1s;
}
#inner-06 {
    position: relative;
    font-size: 14px;
     padding-right: 30px;
      padding-left: 30px;
}
#inner-06-2 {
    position: relative;
    font-size: 14px;
     padding-right: 30px;
      padding-left: 30px;
}

.options06{
text-align: center;
}

.main-bottom-left > button{
height: 27.8px;
margin-bottom: 3px;
}

.zerorokuer{
color: #F00
}
#zeroroku-panel {
    position: relative;
    width: auto;
    max-width: 300px;
    height: auto;
    font-family: Calibri;
    font-weight: 700;
    font-size: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 10px;
    display: table;
}
.pyousomodepanel{
pointer-events: auto;
cursor: pointer;
}
.main-06-table {
}
`
    document.body.appendChild(style);
}());//スタイルを設定し読み込ませる

function mode_html(text){
    $('.modepanel').text(text);
    if(text == "OFF"){
        $('.modepanel').css('color','red');
    }
    else
    {
        $('.modepanel').css('color','white');
    }
}
function key_html(text){
    $('.logkennsa').text(text);
}
function info_html(text){
    $('.infozeroroku').text(text);
}
function createSelectBox(selectId){
    //連想配列の配列
    var arrcsb = [
        {val:"0", txt:"0"},{val:"1", txt:"1"},{val:"2", txt:"2"},{val:"3", txt:"3"},{val:"4", txt:"4"},{val:"5", txt:"5"},{val:"6", txt:"6"},
        {val:"7", txt:"7"},{val:"8", txt:"8"},{val:"9", txt:"9"},{val:"A", txt:"A"},{val:"B", txt:"B"},{val:"C", txt:"C"},{val:"D", txt:"D"},
        {val:"E", txt:"E"},{val:"F", txt:"F"},{val:"G", txt:"G"},{val:"H", txt:"H"},{val:"I", txt:"I"},{val:"J", txt:"J"},{val:"K", txt:"K"},
        {val:"L", txt:"L"},{val:"M", txt:"M"},{val:"N", txt:"N"},{val:"O", txt:"O"},{val:"P", txt:"P"},{val:"Q", txt:"Q"},{val:"R", txt:"R"},
        {val:"S", txt:"S"},{val:"T", txt:"T"},{val:"U", txt:"U"},{val:"V", txt:"V"},{val:"W", txt:"W"},{val:"X", txt:"X"},{val:"Y", txt:"Y"},
        {val:"Z", txt:"Z"},{val:"SPACE", txt:"'SPACE"},{val:"CONTROL", txt:"'CONTROL"},{val:"SHIFT", txt:"'SHIFT"},{val:"ALT", txt:"'ALT"},{val:"TAB", txt:"'TAB"},
        {val:"CAPS_LOCK", txt:"'CAPS_LOCK"},{val:"OS_KEY", txt:"'OS_KEY"},{val:"CONTEXT_MENU", txt:"'CONTEXT_MENU"},{val:"BACK_SPACE", txt:"'BACK_SPACE"},{val:"MINUS", txt:"'MINUS"},
        {val:"EQUALS", txt:"'EQUALS"},{val:"OPEN_BRACKET", txt:"'OPEN_BRACKET"},{val:"ENTER", txt:"'ENTER"},{val:"SEMICOLON", txt:"'SEMICOLON"},
        {val:"CLOSE_BRACKET", txt:"'CLOSE_BRACKET"},{val:"COMMA", txt:"'COMMA"},{val:"PERIOD", txt:"'PERIOD"},{val:"SLASH", txt:"'SLASH"},
        {val:"LEFT", txt:"'LEFT"},{val:"UP", txt:"'UP"},{val:"RIGHT", txt:"'RIGHT"},{val:"DOWN", txt:"'DOWN"}
    ];
    let sl = document.getElementById(selectId);
    while(sl.lastChild)
    {
        sl.removeChild(sl.lastChild);
    }
    //連想配列をループ処理で値を取り出してセレクトボックスにセットする
    for(var i=0;i<arrcsb.length;i++){
        let op = document.createElement("option");
        op.value = arrcsb[i].val; //value値
        op.text = arrcsb[i].txt; //テキスト値
        document.getElementById(selectId).appendChild(op);
    }
};
createSelectBox("linesplit8x");
createSelectBox("linesplit16x");
createSelectBox("switchsplit");
createSelectBox("redorespawn");
function selectboxInput(keychecked_val, selectId){
    $(`#${selectId}`).val(keychecked_val);
};
function checkboxInput(true_or_false, selectId){
    $(`#${selectId}`).prop("checked", true_or_false);
};
function inputLocalStrage(key_f, value_f){
    userData[key_f] = value_f;
    localStorage.setItem('splithack_strage', JSON.stringify(userData));
}
function userlocalStrage(){
    var splithackStrage = localStorage.getItem('splithack_strage');
    if(splithackStrage){
        splithackStrage = JSON.parse(splithackStrage);
        //ストレージになんかしらのデータがある場合の処理
        if (splithackStrage['sphversionStrage'] != sphversionThis){
            localStorage.removeItem('splithack_strage');
            localStorage.setItem('splithack_strage', JSON.stringify(splithackData_new));
            alert("Initialized the settings for the 06 Split Hack because its version has changed (06 Split Hack).");
            return splithackData_new;
        }else{
            // alert("データが残ってます！");
            return splithackStrage;
        }
    }else{
        localStorage.removeItem('splithack_strage');
        localStorage.setItem('splithack_strage', JSON.stringify(splithackData_new));
        // alert("データが見つかりません。。。");
        return splithackData_new;
    }
};
var userData = userlocalStrage();
function userDataOutput(userData_f){//設定の表示だけデータ反映。
    selectboxInput(userData_f['splitmode'], "splitmode");
    checkboxInput(userData_f['hidepanel'], "cHide06Panel");
    checkboxInput(userData_f['textselect'], "chatselect");
    selectboxInput(userData_f['line8x'], "linesplit8x");
    selectboxInput(userData_f['line16x'],"linesplit16x");
    selectboxInput(userData_f['modeswitch'], "switchsplit");
    selectboxInput(userData_f['redorespawn'], "redorespawn");
};
userDataOutput(userData);

var button06 = document.getElementById("btn-06split");//ボタン要素の取得
var select_splitmode = document.querySelector("#splitmode");//select要素の取得
var options_splitmode = document.querySelectorAll("#splitmode option");//option要素の取得（配列）
var check = document.getElementById("cHide06Panel");//              hidepanelcheckbox
var check2 = document.getElementById("chatselect");//.                   textselectcheckbox
var select_line8x = document.querySelector("#linesplit8x");//select要素の取得
var options_line8x = document.querySelectorAll("#linesplit8x option");//option要素の取得（配列）
var select_line16x = document.querySelector("#linesplit16x");//select要素の取得
var options_line16x = document.querySelectorAll("#linesplit16x option");//option要素の取得（配列）
var select_modeswitch = document.querySelector("#switchsplit");//select要素の取得
var options_modeswitch = document.querySelectorAll("#switchsplit option");//option要素の取得（配列）
var select_redorespawn = document.querySelector("#redorespawn");//select要素の取得
var options_redorespawn = document.querySelectorAll("#redorespawn option");//option要素の取得（配列）
var userKeybinds = [null,null,null,null];

function settingUpdate(isFirstUpdate){
    select_splitmode = document.querySelector("#splitmode");//select要素の取得
    var modeindex = select_splitmode.selectedIndex;
    mode_html(modename[options_splitmode[ modeindex ].value]);//モードセレクトボックス処理
    mode = modeindex;
    check = document.getElementById("cHide06Panel");
    if (check.checked) {
        $('div#score-panel.ui-pane.interface-color.zerorokupanel').css('display','none');
    } else {
        $('div#score-panel.ui-pane.interface-color.zerorokupanel').css('display','table');
    }
    check2 = document.getElementById("chatselect");
    if (check2.checked) {
        $('table.chat-table').css('-webkit-user-select','text');
    } else {
        $('table.chat-table').css('-webkit-user-select','none');
    }
    select_line8x = document.querySelector("#linesplit8x");//select要素の取得
    var line8xindex = select_line8x.selectedIndex;
    userKeybinds[0] = keycode[options_line8x[ line8xindex ].value];
    select_line16x = document.querySelector("#linesplit16x");//select要素の取得
    var line16xindex = select_line16x.selectedIndex;
    userKeybinds[1] = keycode[options_line16x[ line16xindex ].value];
    select_modeswitch = document.querySelector("#switchsplit");//select要素の取得
    var modeswitchindex = select_modeswitch.selectedIndex;
    userKeybinds[2] = keycode[options_modeswitch[ modeswitchindex ].value];
    select_redorespawn = document.querySelector("#redorespawn");//select要素の取得
    var redorespawnindex = select_redorespawn .selectedIndex;
    userKeybinds[3] = keycode[options_redorespawn [ redorespawnindex ].value];
    if (!(isFirstUpdate)){
        inputLocalStrage("splitmode", options_splitmode[ modeindex ].value);
        inputLocalStrage("hidepanel", check.checked);
        inputLocalStrage("textselect", check2.checked);
        inputLocalStrage("line8x", options_line8x[ line8xindex ].value);
        inputLocalStrage("line16x", options_line16x[ line16xindex ].value);
        inputLocalStrage("modeswitch", options_modeswitch[ modeswitchindex ].value);
        inputLocalStrage("redorespawn", options_redorespawn[ redorespawnindex ].value);
    }
};
settingUpdate(true);

if($('#donut-freezeMode').length){
    var select_donut_freezeMode = document.querySelector("#donut-freezeMode");//select要素の取得
    var options_donut_freezeMode = document.querySelectorAll("#donut-freezeMode option");//option要素の取得（配列）
    select_donut_freezeMode.addEventListener('change', function(){//select要素のchangeイベントの登録            redorespawn
        var donut_freezeModeindex = select_donut_freezeMode .selectedIndex;
        if(options_donut_freezeMode[ donut_freezeModeindex ].value == "hold"){
            alert("The freeze mode of the donut feature must be ”toggle” for it to work properly.(06 Split Hack)");
        }
    });
};

button06.addEventListener("click", function(e) {//06 setting ボタンをクリックした時の処理
    e.preventDefault();
    var main_06 = document.getElementById("main-06");
    var main_06_2 = document.getElementById("main-06-2");
    if(main_06.style.opacity != 0){
        main_06.style.opacity = 0;
        main_06_2.style.opacity = 1;
        main_06.style.pointerEvents = "none";
    }
    else{
        main_06.style.opacity = 1;
        main_06_2.style.opacity = 0;
        main_06.style.pointerEvents = "auto";
    }
});
document.getElementById("pyousomodebtn").onclick = function() {//                        06パネルクリック処理
    ++mode;//システム内情報更新
    mode_html(modename[options_splitmode[mode%5].value]);//パネル表示更新
    select_splitmode.selectedIndex = mode%5;//セレクトボックス表示更新
    inputLocalStrage("splitmode", options_splitmode[mode%5].value);//ローカルストレージに保存
};
document.getElementById("menu-namecopy").onclick = function() {//                        copynameクリック処理
    var chat = document.getElementById("chat-input");
    var chatcontext = document.getElementById("chat-input").value;
    var cn = $("li#context-name").text();
    chat.value = chatcontext + cn;
};
select_splitmode.addEventListener('change', function(){settingUpdate(false)});//select要素のchangeイベントの登録             splitmode
check.addEventListener("click", function (e) {settingUpdate(false)});//              hidepanelcheckbox
check2.addEventListener("click", function (e) {settingUpdate(false)});//              textselectcheckbox
select_line8x.addEventListener('change', function(){settingUpdate(false)});//select要素のchangeイベントの登録            line8x
select_line16x.addEventListener('change', function(){settingUpdate(false)});//select要素のchangeイベントの登録            line16x
select_modeswitch.addEventListener('change', function(){settingUpdate(false)});//select要素のchangeイベントの登録          modeswitch
select_redorespawn.addEventListener('change', function(){settingUpdate(false)});//select要素のchangeイベントの登録            redorespawn

//ここからキーボードが押された時の処理
document.onkeydown = function(evt) {
    evt = evt || window.event;

    kQuadSplit = document.getElementById("kQuadSplit").textContent;
    kDoubleSplit = document.getElementById("kDoubleSplit").textContent;
    kSplit = document.getElementById("kSplit").textContent;
    kFreezeMouse = document.getElementById("kFreezeMouse").textContent;
    scorem = document.getElementById("score-mouse");
    kTripleSplit = document.getElementById("kTripleSplit").textContent;
    kHexaSplit = document.getElementById("kHexaSplit").textContent;
    var split_aa = new Object({"2x":keycode[kSplit], "4x":keycode[kDoubleSplit], "8x":keycode[kTripleSplit], "16x":keycode[kQuadSplit], "64x":keycode[kHexaSplit], "Line8x":userKeybinds[0], "Line16x":userKeybinds[1]});

    function split(times = 1) {
        for (var i = 0; i < times; i++) {
            $(window).trigger($.Event('keydown', {keyCode: keycode[kSplit], which: keycode[kSplit]}));
        }
    }
    function freeze(t){
        if(t==0){
            $(window).trigger($.Event('keydown', {//E
                keyCode: keycode[kFreezeMouse],
                which: keycode[kFreezeMouse]
            }))
        }
        if(t==1){
            if(scorem.style.display != 'none') {
                $(window).trigger($.Event('keydown', {//E
                    keyCode: keycode[kFreezeMouse],
                    which: keycode[kFreezeMouse]
                }))
            }
        }
    }
    function resetlinef(){
        gotaMenu.style.zIndex = '2';
        gotaMenu.style.display = 'none';
    }
    function split_html(text){
        $('.printsplit').text(text);
    }
    function panel_er_html(text){
        $('.zerorokuer').text(text);
    }

    key_html(Object.keys(keycode).filter( (key) => {
        return keycode[key] === evt.keyCode;
    }));

    split_html(Object.keys(split_aa).filter( (key) => {
        return split_aa[key] === evt.keyCode;
    }));



    if(!(kQuadSplit in keycode && kDoubleSplit in keycode && kSplit in keycode && kFreezeMouse in keycode)){
        panel_er_html("キーを設定してください。Please set keybinds.");
        mode = 4;
        inputLocalStrage("splitmode", options_splitmode[mode%5].value);//ローカルストレージに保存
        select_splitmode.selectedIndex = 4;
        mode_html(modename["OFF"]);
        gotaMenu.style.zIndex = '2';
    }
    else
    {
        if($('#donut-freezeMode').length){
            select_donut_freezeMode = document.querySelector("#donut-freezeMode");//select要素の取得
            options_donut_freezeMode = document.querySelectorAll("#donut-freezeMode option");//option要素の取得（配列）
            var donut_freezeModeindex = select_donut_freezeMode .selectedIndex;
            if(options_donut_freezeMode[ donut_freezeModeindex ].value == "hold"){
                panel_er_html("The freeze mode of the donut feature must be ”toggle” for it to work properly.");
                mode = 4;
                inputLocalStrage("splitmode", options_splitmode[mode%5].value);//ローカルストレージに保存
                select_splitmode.selectedIndex = 4;
                mode_html(modename["OFF"]);
                gotaMenu.style.zIndex = '2';
            }
            else{
                panel_er_html("");
                if (evt.keyCode == userKeybinds[2]){//P80
                    ++mode;//システム内情報更新
                    mode_html(modename[options_splitmode[mode%5].value]);//パネル表示更新
                    select_splitmode.selectedIndex = mode%5;//セレクトボックス表示更新
                    inputLocalStrage("splitmode", options_splitmode[mode%5].value);//ローカルストレージに保存
                }
            }
        }
        else
        {
            panel_er_html("");
            if (evt.keyCode == userKeybinds[2]){//P80
                ++mode;//システム内情報更新
                mode_html(modename[options_splitmode[mode%5].value]);//パネル表示更新
                select_splitmode.selectedIndex = mode%5;//セレクトボックス表示更新
                inputLocalStrage("splitmode", options_splitmode[mode%5].value);//ローカルストレージに保存
            }
        }
    }

    if (evt.keyCode == userKeybinds[3]){//B66
        advertisement.style.display = 'none';
        document.getElementById('btn-play').click();
        resetlinef();
    }

    if (mode%5==0){
        if (evt.keyCode == keycode[kDoubleSplit]){//4x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }

        if (evt.keyCode == keycode[kSplit]){//2x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }


        if (evt.keyCode == keycode[kQuadSplit]){//16x
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
                freeze(1);
                setTimeout( ()=>{
                    freeze(0);
                }, 110 );
            }
            else{
                if(vkaisuu==0){
                    if(scorem.style.display != 'block') {
                        setTimeout( ()=>{
                            freeze(0);
                        }, 110 );
                        ++vkaisuu;
                    }
                    else{
                        if(linereset==0){
                            freeze(1);
                            setTimeout( ()=>{
                                freeze(0);
                            }, 110 );
                            ++vkaisuu;
                        }
                    }
                }
                else if (vkaisuu==1){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 20 );
                    ++vkaisuu;
                }
                else if (vkaisuu==2){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 20 );
                    ++vkaisuu;
                }
                else{
                    freeze(1);
                }
            }
        }

        if (evt.keyCode == userKeybinds[0]){//Q81
            if(scorem.style.display != 'none') {
                split(3);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }

        if (evt.keyCode == userKeybinds[1]){//16xline
            if(scorem.style.display != 'none') {
                split(4);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }
    }

    if (mode%5==1){
        if (evt.keyCode == keycode[kDoubleSplit]){//4x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }

        if (evt.keyCode == keycode[kSplit]){//2x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }


        if (evt.keyCode == keycode[kQuadSplit]){//16x
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
                freeze(1);
                setTimeout( ()=>{
                    freeze(0);
                }, 150 );
            }
            else{
                if(vkaisuu==0){
                    if(scorem.style.display != 'block') {
                        setTimeout( ()=>{
                            freeze(0);
                        }, 150 );
                        ++vkaisuu;
                    }
                    else{
                        if(linereset==0){
                            freeze(1);
                            setTimeout( ()=>{
                                freeze(0);
                            }, 150 );
                            ++vkaisuu;
                        }
                    }
                }
                else if (vkaisuu==1){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 27 );
                    ++vkaisuu;
                }
                else if (vkaisuu==2){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 27 );
                    ++vkaisuu;
                }
                else{
                    freeze(1);
                }
            }
        }

        if (evt.keyCode == userKeybinds[0]){//Q81
            if(scorem.style.display != 'none') {
                split(3);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }

        if (evt.keyCode == userKeybinds[1]){//16xline
            if(scorem.style.display != 'none') {
                split(4);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }
    }

    if (mode%5==2){
        if (evt.keyCode == keycode[kDoubleSplit]){//4x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }

        if (evt.keyCode == keycode[kSplit]){//2x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }


        if (evt.keyCode == keycode[kQuadSplit]){//16x
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
                freeze(1);
                setTimeout( ()=>{
                    freeze(0);
                }, 100 );
            }
            else{
                if(vkaisuu==0){
                    if(scorem.style.display != 'block') {
                        setTimeout( ()=>{
                            freeze(0);
                        }, 30 );
                        ++vkaisuu;
                    }
                    else{
                        if(linereset==0){
                            freeze(1);
                            setTimeout( ()=>{
                                freeze(0);
                            }, 100 );
                            ++vkaisuu;
                        }
                    }
                }
                else if (vkaisuu==1){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 15 );
                    ++vkaisuu;
                }
                else if (vkaisuu==2){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 15 );
                    ++vkaisuu;
                }
                else{
                    freeze(1);
                }
            }
        }

        if (evt.keyCode == userKeybinds[0]){//Q81
            if(scorem.style.display != 'none') {
                split(3);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }

        if (evt.keyCode == userKeybinds[1]){//16xline
            if(scorem.style.display != 'none') {
                split(4);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }
    }

    if (mode%5==3){
        if (evt.keyCode == keycode[kDoubleSplit]){//4x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }

        if (evt.keyCode == keycode[kSplit]){//2x
            vkaisuu=0;
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
            freeze(1);
        }


        if (evt.keyCode == keycode[kQuadSplit]){//16x
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
                freeze(1);
                setTimeout( ()=>{
                    freeze(0);
                }, 50 );
            }
            else{
                if(vkaisuu==0){
                    if(scorem.style.display != 'block') {
                        setTimeout( ()=>{
                            freeze(0);
                        }, 1 );
                        ++vkaisuu;
                    }
                    else{
                        if(linereset==0){
                            freeze(1);
                            setTimeout( ()=>{
                                freeze(0);
                            }, 50 );
                            ++vkaisuu;
                        }
                    }
                }
                else if (vkaisuu==1){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 15 );
                    ++vkaisuu;
                }
                else if (vkaisuu==2){
                    freeze(1);
                    setTimeout( ()=>{
                        freeze(0);
                    }, 15 );
                    ++vkaisuu;
                }
                else{
                    freeze(1);
                }
            }
        }

        if (evt.keyCode == userKeybinds[0]){//Q81
            if(scorem.style.display != 'none') {
                split(3);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }

        if (evt.keyCode == userKeybinds[1]){//16xline
            if(scorem.style.display != 'none') {
                split(4);
                vkaisuu=0;
                linereset=1;
                if(gotaMenu.style.display == 'none') {
                    gotaMenu.style.zIndex = '-2';
                    gotaMenu.style.display = 'block';
                    line_totyuu = setTimeout(function lineend() {
                        if(linereset==1){
                            resetlinef();
                            linereset=0;
                        }
                    }, 1050);
                }
            }
            else{
                vkaisuu=0;
            }
        }
    }

    if (mode%5==4){

        if(evt.keyCode ==keycode[kQuadSplit] || evt.keyCode == keycode[kSplit] || evt.keyCode == keycode[kDoubleSplit] || evt.keyCode == keycode[kTripleSplit] || evt.keyCode == keycode[kHexaSplit]){
            if(linereset==1){
                clearTimeout(line_totyuu);
                linereset=0;
                resetlinef();
            }
        }

        if (evt.keyCode == userKeybinds[0]){//Q81
            split(3);
            linereset=1;
            if(gotaMenu.style.display == 'none') {
                gotaMenu.style.zIndex = '-2';
                gotaMenu.style.display = 'block';
                line_totyuu = setTimeout(function lineend() {
                    if(linereset==1){
                        resetlinef();
                        linereset=0;
                    }
                }, 1050);
            }
        }

        if (evt.keyCode == userKeybinds[1]){//line16x
            split(4);
            linereset=1;
            if(gotaMenu.style.display == 'none') {
                gotaMenu.style.zIndex = '-2';
                gotaMenu.style.display = 'block';
                line_totyuu = setTimeout(function lineend() {
                    if(linereset==1){
                        resetlinef();
                        linereset=0;
                    }
                }, 1050);
            }
        }
    }
}
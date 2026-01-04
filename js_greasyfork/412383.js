// ==UserScript==
// @name         	SBM
// @name:ko      	SBM
// @version      	0.3
// @description  	스팀 프로필 차단 또는 메모에 대한 추가 기능을 제공합니다.
// @author       	degall_udong
// @namespace    	unknown
// @include      	*steamcommunity.com*
// @downloadURL https://update.greasyfork.org/scripts/412383/SBM.user.js
// @updateURL https://update.greasyfork.org/scripts/412383/SBM.meta.js
// ==/UserScript==

if (document.querySelector("[name='abuseID']") != null){
    var prof_num = document.querySelector("[name='abuseID']").value;
    var MMDATA = localStorage.getItem(prof_num);
}

function memo_export_Chrome () {

    var new_exportText = document.createTextNode('메모 데이터 내보내기');
    var new_importText = document.createTextNode('메모 데이터 가져오기');
    var tagloc = document.querySelector("[class='profile_friends title_bar']");
    var modf_style = document.querySelector("[class='profile_friends title']");

    var export_btn = document.createElement('button');
    var import_btn = document.createElement('button');
    var span_1 = document.createElement('span');
    var span_2 = document.createElement('span');

    export_btn.setAttribute("id","memo_data_export");
    export_btn.setAttribute("class","profile_friends manage_link btnv6_blue_hoverfade btn_small btn_uppercase");
    import_btn.setAttribute("id","memo_data_import");
    import_btn.setAttribute("class","profile_friends manage_link btnv6_blue_hoverfade btn_small btn_uppercase");
    export_btn.onclick = export_exc
    import_btn.onclick = import_exc

    span_1.appendChild(new_exportText);
    span_2.appendChild(new_importText);
    export_btn.appendChild(span_1);
    import_btn.appendChild(span_2);

    modf_style.style.minWidth = "100px";
    tagloc.insertBefore(export_btn, document.querySelector("[id='manage_friends_control']"))
    tagloc.insertBefore(import_btn, document.querySelector("[id='manage_friends_control']"))
}

function import_exc(){
    ShowConfirmDialog(
		'메모 덮어쓰기',
		'기존 메모 데이터가 존재할 경우 어떻게 하시겠습니까? 중복된 메모 아이템에 기존 데이터를 유지할 수 있고 덮어쓸 수 있습니다.',
		'덮어쓰기',
		null,
		'데이터 유지').done( function(over) {
        var key;
        var re = /\D/;

        function processFile(file) {
            var reader = new FileReader();
            reader.onload = function () {
                exc(JSON.parse(reader.result));
            };
            reader.readAsText(file);
        }

        var input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json"; // 확장자가 xxx, yyy 일때, ".xxx, .yyy"
        input.onchange = function (event) {
        processFile(event.target.files[0]);
        };
        input.click();

        function exc(json_string){
        if (over == 'OK'){

            // = > Y
            //기존에 있던 정보들을 덮어 씀. 충돌되지 않는 데이터에는 영향이 없음.
            for(key in json_string) {
                if ( re.test(key)!= true ){
                    localStorage.setItem(key,json_string[key]);
                }
            }
        }
        else{
            // = > N
            //기존에 있는 정보는 건드리지 않음
            for(key in json_string) {
                if (re.test(key) != true){
                    if(localStorage.getItem(key) == null){
                        localStorage.setItem(key,json_string[key]);
                    }
                }
            }
        }
        }
    });
}




function Mod_dialog(){
    var dialog_p = document.querySelector("[class='newmodal_content']>div");
    var msg = dialog_p.innerHTML;
    dialog_p.innerHTML = msg + "<br> 이 실행은 유저스크립트와 관계 없이 스팀 대화 및 댓글에 대한 작업을 의미합니다. <br> 유저스크립트 내의 작업은 이미 진행되었습니다.";
}

function Red(){
    var sp_mth_l = document.querySelector("[class='profile_header_summary']");
    var new_ele = document.createElement( 'div' );
    var memo_ele = document.createElement( 'a' );
    var new_eleText = document.createTextNode( '해당 사용자는 차단메모된 사용자입니다.');
    var memo = MMDATA.split(':')[1];
    var memo_eleText = document.createTextNode(memo);
    new_ele.setAttribute("id","bldisplayusjs_id");
    new_ele.setAttribute("class","bldisplayusjs_class");
    new_ele.style.color="#FF0000";
    new_ele.style.fontSize="15px";
    memo_ele.setAttribute("id","memousjs_id");
    memo_ele.setAttribute("class","memousjs_class");
    memo_ele.style.color="#FF0000";
    memo_ele.style.fontSize="13px";
    new_ele.appendChild(new_eleText);
    memo_ele.appendChild(memo_eleText);
    sp_mth_l.insertBefore(new_ele,document.querySelector("[class='profile_summary_footer']"));
    sp_mth_l.insertBefore(memo_ele,document.querySelector("[class='profile_summary_footer']"));
}

function export_exc() {
    ShowConfirmDialog("메모 데이터 내보내기", "메모 데이터를 내보냅니다.")
        .done( function () {
        var content = JSON.stringify(localStorage);
        var blob = new Blob([content], { type: 'application/json' });
        var objURL__ = window.URL.createObjectURL(blob);
        if (window.__Xr_objURL_forCreatingFile__) {
            window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
        }
        window.__Xr_objURL_forCreatingFile__ = objURL__;
        var a = document.createElement('a');
        a.download = "MemoData";
        a.href = objURL__;
        a.click();
    });
}


function Blue(){
    var sp_mth_l = document.querySelector("[class='profile_header_summary']");
    var memo_ele = document.createElement( 'a' );
    var memo = MMDATA.split(':')[1];
    var memo_eleText = document.createTextNode(memo);
    memo_ele.setAttribute("id","memousjs_id");
    memo_ele.setAttribute("class","memousjs_class");
    memo_ele.style.color="#0000ff";
    memo_ele.style.fontSize="13px";
    memo_ele.appendChild(memo_eleText);
    sp_mth_l.insertBefore(memo_ele,document.querySelector("[class='profile_summary_footer']"));
}

function register(){
    ShowConfirmDialog( '차단 메모', "정말로?")
        .done( function() {
        ShowPromptDialog("\ucc28\ub2e8 \uba54\ubaa8\ud558\uae30", "\uba54\ubaa8\ud560 \ucc28\ub2e8 \uc0ac\uc720\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694.","\uc800\uc7a5\ud558\uae30", "\ucde8\uc18c")
        .done( function (memo, other){
                if (memo != null){
                    localStorage.setItem(prof_num,"2:" + memo);
                    javascript:ConfirmBlock();
                    Mod_dialog();
                }
        }
              );
    }
              );
}
function unregister(){
    ShowConfirmDialog( '차단 메모 해제', '차단 메모 기록을 삭제하고, 차단을 해제합니다.' )
        .done( function() {
        localStorage.setItem(prof_num,null);
        javascript:ConfirmUnblock();
        Mod_dialog();
    }
              );
}
function unmemo_f(){
    ShowConfirmDialog( '메모 삭제', '저장된 메모 기록을 삭제합니다.' )
        .done( function() {
        localStorage.setItem(prof_num,null);
    }
              );
}
function modifymemo(){
    ShowConfirmDialog( '메모 수정', '저장된 메모 기록을 수정하시겠습니까?' )
        .done( function(){
        if(MMDATA == null){
            ShowPromptDialog("\uba54\ubaa8\ud558\uae30", "\uba54\ubaa8\ub97c \uc785\ub825\ud558\uc138\uc694.", "\uc800\uc7a5\ud558\uae30", "\ucde8\uc18c" )
           .done( function (Nmemo, other){
                var memo = Nmemo;
                if (memo != null){
                    localStorage.setItem(prof_num, 1 +":" + Nmemo);
                }
            }
                 );
        }
        else{
            ShowPromptDialog("\uba54\ubaa8 \uc218\uc815\ud558\uae30", "\uba54\ubaa8\ub97c \uc785\ub825\ud558\uc138\uc694.", "\uc800\uc7a5\ud558\uae30", "\ucde8\uc18c" )
            .done( function (Itmemo, other){
                var num_memo = localStorage.getItem(prof_num).split(':')[0]
                var memo = Itmemo;
                if (memo != null){
                    localStorage.setItem(prof_num, num_memo +":" + memo);
                }
            }
                  );
        }
    }
              );
}
function Mod_btn_new(){
    var mth_drop = document.querySelector("[class='popup_body popup_menu shadow_content'");
    var blnmemo = document.createElement( 'a' );
    var onlymemo = document.createElement( 'a' );
    var new_blnmemoText = document.createTextNode( '\u00a0 차단 및 메모하기');
    var memoText = document.createTextNode( '\u00a0 메모만 하기' );
    var img_src_blnmemo = document.createElement("img");
    img_src_blnmemo.src = "https://raw.githubusercontent.com/degalludong/SBM-userscript/main/chadan.png"; // 차단메모 이미지 경로 설정
    var img_src_memo = document.createElement("img");
    img_src_memo.src = "https://raw.githubusercontent.com/degalludong/SBM-userscript/main/memo.png"; // 메모만 하기 이미지 경로 설정
    blnmemo.setAttribute("class","popup_menu_item");
    blnmemo.onclick = register
    onlymemo.setAttribute("class","popup_menu_item");
    onlymemo.onclick = modifymemo
    blnmemo.appendChild(img_src_blnmemo);
    onlymemo.appendChild(img_src_memo);
    blnmemo.appendChild(new_blnmemoText);
    onlymemo.appendChild(memoText);
    mth_drop.appendChild(blnmemo);
    mth_drop.appendChild(onlymemo);
}
function Mod_btn_memoed(){
    var mth_drop = document.querySelector("[class='popup_body popup_menu shadow_content'");
    var unmemo = document.createElement( 'a' );
    var modmemo = document.createElement( 'a' );
    var new_unmemoText = document.createTextNode( '\u00a0 메모 삭제하기');
    var new_modmemoText = document.createTextNode( '\u00a0 메모 수정하기' );
    var img_src_unmemo = document.createElement("img");
    img_src_unmemo.src = "https://raw.githubusercontent.com/degalludong/SBM-userscript/main/chadan.png"; // 메모삭제 이미지 경로 설정
    var img_src_mdmm = document.createElement("img");
    img_src_mdmm.src = "https://raw.githubusercontent.com/degalludong/SBM-userscript/main/memo.png"; // 메모수정 이미지 경로 설정
    unmemo.setAttribute("class","popup_menu_item");
    unmemo.onclick = unmemo_f
    modmemo.setAttribute("class","popup_menu_item");
    modmemo.onclick = modifymemo
    unmemo.appendChild(img_src_unmemo);
    modmemo.appendChild(img_src_mdmm);
    unmemo.appendChild(new_unmemoText);
    modmemo.appendChild(new_modmemoText);
    mth_drop.appendChild(unmemo);
    mth_drop.appendChild(modmemo);
}

function Mod_btn_blocked(){
    var mth_drop = document.querySelector("[class='popup_body popup_menu shadow_content'");
    var blnmemo = document.createElement( 'a' );
    var modmemo = document.createElement( 'a' );
    var new_ublnmemoText = document.createTextNode( '\u00a0 차단해제 및 메모 삭제하기');
    var new_modmemoText = document.createTextNode( '\u00a0 메모 수정하기' );
    var img_src_ub = document.createElement("img");
    img_src_ub.src = "https://raw.githubusercontent.com/degalludong/SBM-userscript/main/chadan.png"; // 차단해제 이미지 경로 설정
    var img_src_mdmm = document.createElement("img");
    img_src_mdmm.src = "https://raw.githubusercontent.com/degalludong/SBM-userscript/main/memo.png"; // 메모수정 이미지 경로 설정
    blnmemo.setAttribute("class","popup_menu_item");
    blnmemo.onclick = unregister
    modmemo.setAttribute("class","popup_menu_item");
    modmemo.onclick = modifymemo
    blnmemo.appendChild(img_src_ub);
    modmemo.appendChild(img_src_mdmm);
    blnmemo.appendChild(new_ublnmemoText);
    modmemo.appendChild(new_modmemoText);
    mth_drop.appendChild(blnmemo);
    mth_drop.appendChild(modmemo);
}
(function () {
    if(document.querySelector("[id='friends_blocked']") != null){
        memo_export_Chrome();
       }
       else{
           if(MMDATA == null){
               Mod_btn_new();
           }
           else if(MMDATA.split(':')[0] == 2){
               Red();
               Mod_btn_blocked();
           }
           else if(MMDATA.split(':')[0] == 1){
               Blue();
               Mod_btn_memoed();
           }
           else{
               Mod_btn_new();
           }
       }
}
)();



// ==UserScript==
// @name          보배드림 닉네임차단
// @author        보배이용자
// @namespace     없다
// @version       2.2.4
// @include       *://*bobaedream.co.kr/*
// @description   특정 닉네임의 게시글 색상변경 및 클릭시 물어보기 & 댓글차단 2.0 부터 버그 픽스는 맨마지막 버전을따름 중간버전은 기능 추가/업데이트
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.listValues
// @grant GM.deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414948/%EB%B3%B4%EB%B0%B0%EB%93%9C%EB%A6%BC%20%EB%8B%89%EB%84%A4%EC%9E%84%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/414948/%EB%B3%B4%EB%B0%B0%EB%93%9C%EB%A6%BC%20%EB%8B%89%EB%84%A4%EC%9E%84%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==

var blockUserLists= [
    '이웃과함께','계몽군주김정은','관종식물','와앙강우','THENEWK7PS','비깨도','문재인이머했너'
];
var mystoreg
if(window.localStorage.getItem('enc_id')==null?true:false){
    mystoreg = window.localStorage;
}
window.Object['cueent_enc_id']="";
window.Object['current_color']="";
window.Object['non_pop_check']= 0;
let gm_before,gm_after,list_count;
(async () => {
    list_count = await GM.listValues();
    if(list_count.some(function(arrayValue){return "enc_id" === arrayValue;})){//차단 리스트
        gm_before = await GM.getValue('enc_id');
        console.log('Greasemonkey get has run', gm_before);
        if(gm_before.length != 0){
            let list = [];
            if(localStorage.getItem('enc_id')==null?true:false){
                localStorage.getItem('enc_id',[]);
            }else{
                if(JSON.parse(localStorage.getItem('enc_id')).length!=0){
                    list = JSON.parse(localStorage.getItem('enc_id'));
                    list.forEach(function(item,index){//공란제거
                        if(item+"".length==0){
                            list.splice(index,1);
                        }else{
                            list[index]= decodeURIComponent(item);//인코딩오류 수정
                        }
                    });
                    gm_before = await GM.setValue('enc_id', JSON.parse(JSON.stringify(remove_duplicates_safe(list))));
                    gm_after = await GM.getValue('enc_id');
                    //localStorage.setItem('enc_id', JSON.stringify(gm_after));
                    console.log('Greasemonkey set has run', gm_after);
                }else{
                    gm_after = await GM.getValue('enc_id');
                    localStorage.setItem('enc_id', JSON.stringify(gm_after));
                    console.log('Greasemonkey set localstorage has run', gm_after);
                }
            }

        }else{

        }
    }
    if(!list_count.some(function(arrayValue){return "color" === arrayValue;})){
        GM.setValue('color',"none");//기본 색상정보
    }
    if(list_count.some(function(arrayValue){return "color" === arrayValue;})){
        gm_before = await GM.getValue('color');
        console.log('Greasemonkey color get has run', gm_before);
        if(gm_before=="none"){
            Object['current_color'] = 'none';
        }else{
            Object['current_color'] = gm_before;
        }
    }

    if(!list_count.some(function(arrayValue){return "non_pop_check" === arrayValue;})){
        GM.setValue('non_pop_check',0);//기본 체크정보
    }
    if(list_count.some(function(arrayValue){return "non_pop_check" === arrayValue;})){
        gm_before = await GM.getValue('non_pop_check');
        console.log('Greasemonkey non_pop_check get has run', gm_before);
        if(gm_before==0){
            Object['non_pop_check'] = 0;
        }else{
            Object['non_pop_check'] = gm_before;
        }
    }
    // Note awaiting the set -- required so the next get sees this set.
    //await GM.setValue('count', gm_before + 1);

    // Get the value again, just to demonstrate order-of-operations.

})();

//회원아이디 클릭 이베트 감지 설정
var config = { childList: true };
let add_ct=0;
$(document).ready(function(){
    waitForKeyElements("head",function(){
        addGlobalStyle(".modal {  display: none; /* Hidden by default */  position: fixed; /* Stay in place */  z-index: 900; /* Sit on top */  padding-top: 100px; /* Location of the box */  left: 0;  top: 0;  width: 100%; /* Full width */  height: 100%; /* Full height */  overflow: auto; /* Enable scroll if needed */  background-color: rgb(0,0,0); /* Fallback color */ background-color: rgba(0,0,0,0.4); /* Black w/ opacity */}"
                       +".modal-content {  background-color: #fefefe;  margin: auto;  padding: 20px;  border: 1px solid #888;  width: 50%;}"
                       +".close {  color: #aaaaaa;  float: right;  font-size: 28px;  font-weight: bold;}"
                       +".close:hover,.close:focus {  color: #000;  text-decoration: none;  cursor: pointer;}");
        modal_alert("",0);
    });
    //회원아이디 클릭 이벤트 감지 타겟
    waitForKeyElements("#bobaeHead > div.top-container > div.component > div.top-util-wrapper",function(){

        var colorSet = '<div style=\"float: left;padding-top: 19px !important;height: 23px;line-height: 23px;margin-right: 20px;\">';
        let color = Object['current_color'];
        if(color == "none"){
            colorSet +='<select id=\"color_set\" onchange=\"Object.fn_colorset(this);\" style=\"background-color: rgba(200,200,0,0.5);\">';
        }else{
            colorSet +='<select id=\"color_set\" onchange=\"Object.fn_colorset(this);\" style=\"background-color: '+color+';\">';
        }
        colorSet +='<option value=\"none\" '+(Object['current_color']=="none"?'selected':'')+'>선택</option>';
        colorSet +='<option value=\"rgba(255,0,0,0.5)\" style=\"background: rgba(255,0,0,0.5);\"'+(Object['current_color']=="rgba(255,0,0,0.5)"?'selected':'')+'>빨강</option>';
        colorSet +='<option value=\"rgba(0,255,0,0.5)\" style=\"background: rgba(0,255,0,0.5);\"'+(Object['current_color']=="rgba(0,255,0,0.5)"?'selected':'')+'>초록</option>';
        colorSet +='<option value=\"rgba(0,0,255,0.5)\" style=\"background: rgba(0,0,255,0.5);\"'+(Object['current_color']=="rgba(0,0,255,0.5)"?'selected':'')+'>파랑</option>';
        colorSet +='</select>';
        colorSet +='</div>';
        var noti_button = "<INPUT type='button' value='공지열기' style='font-size:small;margin-right: 20px;' onclick='Object.fn_modal_view();'>";
        var bkck_up = "<a href=\"javascript:Object.download('차단리스트_.json','application/json');\" style=\"margin-right: 20px;\">백업</a>";
        var restore = "<a href=\"javascript:Object.openFile();\" style=\"margin-right: 20px;\">복원</a>";
        var range = document.createRange();
        range.selectNode(document.getElementsByTagName("div").item(0));
        var documentFragment1 = range.createContextualFragment(colorSet);
        var documentFragment2 = range.createContextualFragment(noti_button);
        var documentFragment3 = range.createContextualFragment(bkck_up);
        var documentFragment4 = range.createContextualFragment(restore);
        //.top-util-wrapper
        document.querySelector("#bobaeHead > div.top-container > div.component > div.top-util-wrapper").prepend(documentFragment1);
        document.querySelector("#bobaeHead > div.top-container > div.component > div.top-util-wrapper > div").prepend(documentFragment2);
        document.querySelector("#bobaeHead > div.top-container > div.component > div.top-util-wrapper > div").prepend(documentFragment3);
        document.querySelector("#bobaeHead > div.top-container > div.component > div.top-util-wrapper > div").prepend(documentFragment4);
    });

    waitForKeyElements("#submenusel", function(){
        var observer_target = document.getElementById('submenusel');

        waitForKeyElements("#cmt_reply > li > dl > dt > span.name",function(){
            var target1 = document.querySelectorAll("#cmt_reply > li > dl > dt > span.name");
            for(var i=0;i<target1.length;i++){
                target1[i].addEventListener("mouseenter",function(event){
                    add_ct=0;
                    Object["cueent_enc_id"]= event.target.firstElementChild.attributes.item('onclick').nodeValue.split("','")[0].split("('")[1];
                }); //코멘트
            }
        });
        waitForKeyElements("#boardlist > tbody > tr > td.author02",function(){
            var target2 = document.querySelectorAll("#boardlist > tbody > tr > td.author02");
            for(var i=0;i<target2.length;i++){
                target2[i].addEventListener("mouseenter",function(event){
                    add_ct=0;
                    Object["cueent_enc_id"]= event.target.firstElementChild.attributes.item('onclick').nodeValue.split("');")[0].split("('")[1];
                }); //리스트게시물
            }
        });
        waitForKeyElements("#boardlist > tbody > tr > td.author",function(){
            var target3 = document.querySelectorAll("#boardlist > tbody > tr > td.author");
            for(var i=0;i<target3.length;i++){
                target3[i].addEventListener("mouseenter",function(event){
                    add_ct=0;
                    Object["cueent_enc_id"]= event.target.firstElementChild.attributes.item('onclick').nodeValue.split("');")[0].split("('")[1];
                });//뷰어+리스트 게시물
            }
        });

        var observer = new MutationObserver(
            function(mutations) {

                mutations.forEach(
                    function(mutation) {
                        if(add_ct ==0){
                            if(mutation.type=="childList"){
                                //menu_add(Object["cueent_enc_id"]);
                                $("#submenusel > ol").prepend("<li style='width:130px;height:20px;text-align:left;padding-left:10px;color:4c4c4c;'><a href=\"javascript:Object.fn_save('"+decodeURIComponent(Object["cueent_enc_id"])+"');\">차단하기</a></li>");
                                $("#submenusel > ol").prepend("<li style='width:130px;height:20px;text-align:left;padding-left:10px;color:4c4c4c;'><a href=\"javascript:Object.fn_delete('"+decodeURIComponent(Object["cueent_enc_id"])+"');\">차단해재</a></li>");
                                setTimeout(function(){
                                    var height =0;
                                    $("#submenusel > ol > li").each(function(index,item){height +=item.offsetHeight;});
                                    $("#submenusel").height((height+20)+"px");
                                },500);
                                add_ct++;
                            }
                        }
                    });
            });
        observer.observe(observer_target, config);
    });
    setlocalstoreg(blockUserLists);

});
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}
function getStyle(obj, jsprop, cssprop) {
    if (obj.currentStyle) {
        return obj.currentStyle[jsprop];
    } else if (window.getComputedStyle) {
        return document.defaultView.getComputedStyle(obj, null).getPropertyValue(cssprop);
    } else {
        return null;
    }
}
window.Object["openFile"] =function openFile(){
	var input = document.createElement("input");
	console.log(input);
	input.type = "file";
	// html일 경우 text/html로
    input.accept = "text/plain, application/json";
        document.body.appendChild(input);
        input.style.display = 'none';
	 input.click();
	 input.onchange = function (event) {
	        processFile(event.target.files[0]);
	    };
}
function processFile(file){
	var reader = new FileReader();
	reader.readAsText(file,"euc-kr");
	reader.onload = function () {
        var list = reader.result.split(",");
        list.forEach(function(item,index){//공란제거
            if(item+"".length==0){
                list.splice(index,1);
            }else{
                list[index]= decodeURIComponent(item);//인코딩오류 수정
            }
        });

    localStorage.setItem('enc_id', JSON.stringify(remove_duplicates_safe(list)));
    alert("복구완료");
    setGM(list);
	};
}
window.Object["download"] = function download(name, type){
    var text = JSON.parse(localStorage.getItem('enc_id'));
    var file = new Blob([text], {type: type});
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE){
        window.navigator.msSaveOrOpenBlob(file, name);
    }else{
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }
}
function modal_alert(msg,time){
    var The_moDal,Modal_content,Modla_content_child1,Modal_content_child1_text,Modla_content_child2,Modal_content_child2_text,non_pop_check,non_pop_check_label;
    if(msg==""){
        msg = "간단 사용설명서(로그인 안해도 쓸수있어요)";
        msg +="\n안녕하세요 보배드림 사용자 스크립트를 제작한 러브C 입니다.";
        msg +="\n① 게시물 표시 색상은 상단 로그인버튼 옆에 있는 셀렉트를 이용하시면 변경(선택후 새로고침시 적용)으로 가능합니다.";
        msg +="\n^^^별도선택을 안할경우 디폴트색상으로 지정됩니다.";
        msg +="\n② 사용자 닉네임이 표시되는 게시물, 댓긋 에서 사용자를 클릭하면 \"차단해재\"/\"차단하기\" 를이용하여 차단여부를 선택할수있습니다.";
        msg +="\n^^^특정 사용자의 커뮤니티 페이지는 지원하지안습니다. 해당매뉴로 한번등록시 닉네임을 바꿔도 작동합니다.";
        msg +="\n③ 이 도움말은 아래 체크버튼을 체크하면 더이상 자동으로 뜨지않습니다 필요시 상단 공지열기 버튼을 이용해 열수있습니다.";
        msg +="\n^^^공지열기 버튼을 이용 열었을경우 체크를 해재하면 자동으로 뜨도록 변경됩니다.";
        msg +="\n④ 자바스크립트 기반으로 작성하였습니다. 문의사항은 보배드림 쪽지로 보내시면됩니다.";
        msg +="\n^^^혼자 개발하고 테스트 하다보니..버그가 있을수도 있습니다..";
        msg +="\n-------신규기능추가---------20201127";
        msg +="\n1.브라우저를 여러게 또는 PC가 여러대일경우 차단사용자 리스트를 파일로 백업/복원 기능추가하였습니다.";
    }else{
        msg = msg;
    }
    if(document.querySelector("#myModal")==null?true:false){
        The_moDal = document.createElement('DIV');
        The_moDal.setAttribute("id","myModal");
        The_moDal.setAttribute("class","modal");
        The_moDal.onclick = function(event){
            if (event.target == document.querySelector("#myModal")) {
                document.querySelector("#myModal").style.setProperty("display", "none", "important");
            }
        }

        Modal_content = document.createElement('DIV');
        Modal_content.setAttribute("class","modal-content");
        Modla_content_child1 = document.createElement('SPAN');
        Modla_content_child1.setAttribute("class","close");
        Modal_content_child1_text = document.createTextNode( '×' );
        Modla_content_child1.append(Modal_content_child1_text);
        Modla_content_child1.onclick = function(){
            document.querySelector("#myModal").style.setProperty("display", "none", "important")
        }
        Modal_content.append(Modla_content_child1);

        Modla_content_child2 = document.createElement('P');
        Modla_content_child2.setAttribute("style","line-height: 20px !important;font-weight: bold !important;");
        msg.split("\n").forEach(function(item,index){
            Modal_content_child2_text = document.createTextNode(item.replace(/\^/gi,"\u00A0"));
            Modla_content_child2.append(Modal_content_child2_text);
            Modla_content_child2.append(document.createElement('br'));
        });
        Modal_content.append(Modla_content_child2);

        non_pop_check_label = document.createElement("LABEL");
        non_pop_check_label.setAttribute("style","float: inline-end !important;");
        non_pop_check_label.append(document.createTextNode("더이상 열지않음"));
        non_pop_check = document.createElement("input");
        non_pop_check.id = "non_pop_check";
        non_pop_check.checked = Object['non_pop_check']==0?false:true;
        non_pop_check.type="checkbox";
        non_pop_check.onchange = function(){
            Object.fn_non_pop_check();
        }
        non_pop_check_label.append(non_pop_check);
        Modal_content.append(non_pop_check_label);

        The_moDal.append(Modal_content);
        document.body.append(The_moDal);

    }else{
        document.querySelector("#myModal").childNodes.forEach(function(item,index){item.remove();});
        Modal_content = document.createElement('DIV');
        Modal_content.setAttribute("class","modal-content");
        Modla_content_child1 = document.createElement('SPAN');
        Modla_content_child1.setAttribute("class","close");
        Modal_content_child1_text = document.createTextNode( '×' );
        Modla_content_child1.append(Modal_content_child1_text);
        Modla_content_child1.onclick = function(){
            document.querySelector("#myModal").style.setProperty("display", "none", "!important");
        }
        Modal_content.append(Modla_content_child1);

        Modla_content_child2 = document.createElement('P');
        Modla_content_child2.setAttribute("style","line-height: 20px !important;font-weight: bold !important;");
        msg.split("\n").forEach(function(item,index){
            Modal_content_child2_text = document.createTextNode(item.replace(/\^/gi,"\u00A0"));
            Modla_content_child2.append(Modal_content_child2_text);
            Modla_content_child2.append(document.createElement('br'));
        });
        Modal_content.append(Modla_content_child2);

        The_moDal.append(Modal_content);
        document.body.append(The_moDal);
    }
    if(time != 0){
        setTimeout(function(){
            if(getStyle(document.querySelector("#myModal"), 'display', 'display')!="none"){
                document.querySelector("#myModal").click();
            }
        }, time);
    }else{
        if(Object['non_pop_check']!=1){
            if(getStyle(document.querySelector("#myModal"), 'display', 'display')=="none"){
                //document.querySelector("#myModal").style.setProperty("display", "block", "!important");
                document.querySelector("#myModal").style.cssText="display: block !important;";
            }
        }else{
            if(getStyle(document.querySelector("#myModal"), 'display', 'display')=="none"){
                //document.querySelector("#myModal").style.setProperty("display", "none", "!important");
                document.querySelector("#myModal").style.cssText="display: none !important;";
            }
        }
    }
}
function view_board_list(){
    var link="";
    var templocation="";
    let target = null;
    if(document.querySelectorAll(".author02").length==0){
        target =document.querySelectorAll("td.author");
    }else{
        target = document.querySelectorAll("td.author02");
    }
    for (const nmt of target) {
        for (const undi of blockUserLists) {
            if(nmt.innerHTML.toString().indexOf(undi)!=-1 || check_enc_id(decodeURIComponent(nmt.firstElementChild.getAttribute('onclick').split("')")[0].split("('")[1]))){
                if(Object['current_color'] =="none"){
                    nmt.parentElement.setAttribute("style", "background-color: rgba(200,200,0,0.5);");
                }else{
                    nmt.parentElement.setAttribute("style", "background-color:"+Object['current_color']+";");
                }
                var current_title="";
                if(nmt.parentElement.children[1].getAttribute("class")=="category"){
                    current_title = nmt.parentElement.children[2].firstElementChild.getAttribute("title")==null?nmt.parentElement.children[2].children[0].firstChild.data:nmt.parentElement.children[1].firstElementChild.getAttribute("title");
                }else{
                    current_title = nmt.parentElement.children[1].firstElementChild.getAttribute("title")==null?nmt.parentElement.children[1].children[0].firstChild.data:nmt.parentElement.children[1].firstElementChild.getAttribute("title");
                }
                
                //console.log("=="+nmt.parentElement.querySelector('a').href == null? false:true);
                if(nmt.parentElement.querySelector('a') == null? false:true){//링크가 있는 녀석만 만들기
                    link=nmt.parentElement.querySelector('a').href.split('/view')[1].replace("';}","");
                    templocation = "javascript:if(confirm('차단한글이야 열어볼꺼야?')){this.location='"+"/view"+(link+"';}");
                    nmt.parentElement.querySelector('a').href=templocation;
                    nmt.parentElement.querySelector('a').setAttribute("title",current_title);
                }
                if(document.querySelector("#conView > div > div > div.docuArea02 > div.docuview_updown")!=null){//이전글 다음글 색상표시
                    var up_title = document.querySelector("#conView > div > div > div.docuArea02 > div.docuview_updown > dl > dd:nth-child(2)").firstElementChild.innerText;
                    var down_title = document.querySelector("#conView > div > div > div.docuArea02 > div.docuview_updown > dl > dd:nth-child(4)").firstElementChild.innerText;
                    if(current_title.indexOf(up_title) !=-1){
                        document.querySelector("#conView > div > div > div.docuArea02 > div.docuview_updown > dl > dd:nth-child(2)").firstElementChild.setAttribute("style","color:red");
                    }else if(current_title.indexOf(down_title) !=-1){
                        document.querySelector("#conView > div > div > div.docuArea02 > div.docuview_updown > dl > dd:nth-child(4)").firstElementChild.setAttribute("style","color:red")
                    }
                }
            }
        }
    }
    return;
}

function view_comment_list(){
    var link="";
    let target_comment = null;

    target_comment = document.querySelectorAll(".name");
    for (const nmt of target_comment) {
        var befor_text ="";
        befor_text = nmt.parentElement.parentElement.children[1].innerText;
        if(nmt.parentElement.parentElement.parentElement.getAttribute("class")==null?false:true){//베스트 리플뎃
            if(nmt.parentElement.parentElement.parentElement.getAttribute("class").indexOf("best")!=-1){
                console.log(nmt.parentElement.parentElement.parentElement);
            }
        }
        for (const undi of blockUserLists) {
            if(nmt.innerHTML.toString().indexOf(undi)!=-1||check_enc_id(decodeURIComponent(nmt.firstElementChild.getAttribute('onclick').split("','")[0].split("('")[1]))){

                nmt.parentElement.parentElement.children[1].innerHTML = "차단된사용자의 글입니다.<details><summary>원글보기</summary><span>"+befor_text+"</span></details>";
            }

        }
    }
    return;
}
window.Object["fn_save"] = function save_localstoreg(cid){
    let list = [];
    if((localStorage.getItem('enc_id')==null||localStorage.getItem('enc_id').length==0)?true:false){
        list.push(decodeURIComponent(cid));
    }else{
        var temp = JSON.parse(localStorage.getItem('enc_id'));
        //개선필요
        if(!check_enc_id(cid)){
            temp.push(decodeURIComponent(cid));
        }
        list= temp;
    }
    list.forEach(function(item,index){//공란제거
        if(item+"".length==0){
           list.splice(index,1);
        }else{
            list[index]= decodeURIComponent(item);//인코딩오류 수정
		}
    });

    localStorage.setItem('enc_id', JSON.stringify(remove_duplicates_safe(list)));
    //modal_alert("차단아이디 등록완료\n",300);
    setGM(list);
    alert("차단아이디 등록완료");
}

window.Object["fn_delete"] = function delete_localstoreg(cid){
    let list = [];
    var temp = JSON.parse(localStorage.getItem('enc_id'));
    if(temp.length == 0){
        alert("차단한 사용자가없습니다.");
        return;
    }
    const idx = temp.indexOf(decodeURIComponent(cid));
    if(idx > -1){
        temp.splice(idx,1);
    }
    list = temp;

    localStorage.setItem('enc_id', JSON.stringify(list));
    setGM(list);
    alert("차단아이디 삭제완료");
}

window.Object["fn_colorset"] = function color_set(e){
    if(e.selectedIndex != 0){
        GM.setValue('color',e.selectedOptions.item(0).value);
        document.querySelector("#color_set").setAttribute("style","background-color: "+e.selectedOptions.item(0).value+";");
    }else{
        GM.setValue('color',"none");
        document.querySelector("#color_set").setAttribute("style","background-color: rgba(200,200,0,0.5);");
    }
}
window.Object["fn_non_pop_check"] = function non_pop_check(){
    var check = document.querySelector("#non_pop_check").checked==true?1:0;
    if(check ==1){
        GM.setValue('non_pop_check',check);
        if(getStyle(document.querySelector("#myModal"), 'display', 'display')!="none"){
            document.querySelector("#myModal").click();
        }
    }else{
         GM.setValue('non_pop_check',check);
    }
}
window.Object["fn_modal_view"] = function modal_view(){
    document.querySelector("#myModal").style.cssText="display: block !important;";
    //document.querySelector("#myModal").style.setProperty("display", "block", "!important");
}
async function setGM(list){
    await GM.setValue('enc_id', JSON.parse(JSON.stringify(list))).then((value) =>{
        //console.log(value);
        document.location.reload();
    });
}
async function getGM(find_nm){
    var temp = await GM.getValue(find_nm);
    return temp;
}
function setlocalstoreg(blockUserLists){
    let list = [];
    let target = null;
    let listObject = getGM('enc_id');
    listObject.then((value) =>{
        if(value != undefined){
            localStorage.setItem('enc_id',JSON.stringify(value));
            if(document.querySelectorAll(".author02").length==0){
                target =document.querySelectorAll("td.author");
            }else{
                target = document.querySelectorAll("td.author02");
            }
            for (const nmt of target) {
                for (const undi of blockUserLists) {
                    if(nmt.innerHTML.toString().indexOf(undi)!=-1){
                        if(localStorage.getItem('enc_id')==null?true:false){
                            list.push(nmt.firstElementChild.getAttribute('onclick').split("')")[0].split("('")[1]);
                        }else{
                            var temp = JSON.parse(localStorage.getItem('enc_id'));
                            //개선필요
                            if(!check_enc_id(nmt.firstElementChild.getAttribute('onclick').split("')")[0].split("('")[1])){
                                temp.push(nmt.firstElementChild.getAttribute('onclick').split("')")[0].split("('")[1]);
                            }
                            list= temp;
                        }
                    }

                }
            }
            if(list.length !=0){
                localStorage.setItem('enc_id', JSON.stringify(list));
            }
            waitForKeyElements('#boardlist', view_board_list); //게시물 블럭
            waitForKeyElements('#cmt_list', view_comment_list);// 코맨트리스트
        }else{
            localStorage.setItem('enc_id', []);
        }
    });
}

function check_enc_id(enc_id){
    var ls = JSON.parse(localStorage.getItem('enc_id'));
    return ls.some(function(arrayValue){
        return decodeURIComponent(enc_id) === arrayValue;
    });
}
function remove_duplicates_safe(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;

}
function menu_add(cid){


}
function waitForKeyElements(selectorTxt, /* Required: The jQuery selector string that specifies the desired element(s). */
                             actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element.  */
                             bWaitOnce, /* Optional: If false, will continue to scan for new elements even after the first match is found. */
                             iframeSelector /* Optional: If set, identifies the iframe to search. */
                            ) {
    var targetNodes,
        btargetsFound;
    if (typeof iframeSelector == 'undefined')
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents().find(selectorTxt);
    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
        btargetsFound = false;
    } //--- Get the timer-control variable for this selector.

    var controlObj = waitForKeyElements.controlObj || {
    };
    var controlKey = selectorTxt.replace(/[^\w]/g, '_');
    var timeControl = controlObj[controlKey];
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
                                  );
            }, 300
                                     );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

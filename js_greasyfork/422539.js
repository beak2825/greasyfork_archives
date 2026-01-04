// ==UserScript==
// @name         勤務派工
// @version      1.2.0404.02
// @description  勤務派工外掛
// @author       shiyi.guo
// @match        https://es2019.kbro.tv/admin/work_sheets*
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @grant GM_addElement
// @grant GM_addStyle
// @run-at document-end
// @namespace https://greasyfork.org/users/735860
// @downloadURL https://update.greasyfork.org/scripts/422539/%E5%8B%A4%E5%8B%99%E6%B4%BE%E5%B7%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/422539/%E5%8B%A4%E5%8B%99%E6%B4%BE%E5%B7%A5.meta.js
// ==/UserScript==

//run-at document-start


var PlusStat=false;
var LoadPlusscriptDelay=500;

var WaitJQc=0;
function WaitJQ(){
    if (typeof jQuery == 'undefined') {
        WaitJQc++;
         console.log ("===WaitJQ:"+WaitJQc) ;
        var timeoutID = window.setTimeout(( () => WaitJQ() ), 100);
        return false;
    }else{

        requireFile();
        LoadWSPlus_PreferencesT();
    }
}


(
    /*
document-end
document-idle
'beforebegin': 在 element 之前。
'afterbegin': 在 element 裡面，第一個子元素之前。
'beforeend': 在 element 裡面，最後一個子元素之後。
'afterend': 在 element 之後。

*/
    function() {
        console.log (GM_getValue("LoadPlusscriptDelay"))

        if (GM_getValue("LoadPlusscriptDelay")!=undefined){
            LoadPlusscriptDelay=GM_getValue("LoadPlusscriptDelay");
        }


        console.log ("=============================");
        console.log ("=== RWS Plus Script start.===" );
        console.log (new Date() );
        console.log ("LoadPlusscriptDelay==>"+LoadPlusscriptDelay)
        console.log ("=============================");

        WaitJQ();



        /*
        window.addEventListener('load', () => {
            //document.getElementById("logout_link").insertAdjacentHTML("afterend","<br>Plus(2)");
            LoadPlusscript("loadStat");
        })
        */




    }
)();
//heredoc(function(){/**/});
function requireFile(){
    console.log ("===ADDscript multiple-select@1.5.2");
    GM_addElement('script', {
        src: 'https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.js',
        type: 'text/javascript'
    });
    console.log ("===ADDlink multiple-select@1.5.2CSS");
    GM_addElement('link', {
        rel:  "stylesheet",
        href: 'https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.css'
    });
}

function LoadWSPlus_PreferencesT(){

    var WSPlus_PreferencesT=heredoc(function(){/*
        <div class="modal fade" id="WSPlus_Preferences" tabindex="-1" role="dialog" aria-labelledby="workerModalLabel" style="display: none;" aria-hidden="true">
        	<div class="modal-dialog" role="document">
        		<div class="modal-content">
        		<div class="modal-header">
        			<h5 class="modal-title" id="exampleModalLabel">勤務派工Plus外掛-偏好設定</h5>
        			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
        			<span aria-hidden="true">×</span>
        			</button>
        		</div>
        		<div id="worker_ready" class="modal-body">
        <div class="input-group">
        <div class="input-group-prepend"><span class="input-group-text">延遲時間</span></div>
        <input type="text" id="txt_LoadPlusscriptDelay" aria-label="First name" class="form-control">
        </div>
        		</div>
        		<div class="modal-footer">
        			<!-- <button class="btn btn-info" type="button" id="but_Plus_Preferences_Test" ><i class="fas fa-id-badge"></i> 測試功能</button> -->
        			<button class="btn btn-info" type="button" id="but_Plus_Preferences_ok" ><i class="fas fa-id-badge"></i> 確定</button>
        		</div>
        		</div>
        	</div>
        </div>
      */});

    document.getElementById("workerModal").insertAdjacentHTML("afterend",WSPlus_PreferencesT);

    /*
    var SBut='<li class="nav-item">\
<a id="But_Preference" class="nav-link">\
<i class="fas fa-cogs"></i> <span  class="d-none d-md-inline">外掛設定</span>\
</a>\
</li>';*/

    var SBut= heredoc(function(){/*
     <li class="nav-item">
<a id="But_Preference" class="nav-link">
<i class="fas fa-cogs"></i> <span  class="d-none d-md-inline">外掛設定</span>
</a>
</li>
*/});

    document.getElementsByClassName("navbar-nav")[0].insertAdjacentHTML("afterbegin",SBut);
    $("#But_Preference").on("click", function (e) {
        console.log ("=============================");

        $("#txt_LoadPlusscriptDelay").val(LoadPlusscriptDelay);
        $("#WSPlus_Preferences").modal("toggle");
        //Set_worksheet_Plus();
    });

    $("#but_Plus_Preferences_ok").on("click", function (e) {
        console.log ("=============================");
        console.log ("===LoadPlusscriptDelay:", $("#txt_LoadPlusscriptDelay").val());

        LoadPlusscriptDelay=$("#txt_LoadPlusscriptDelay").val();
        GM_setValue("LoadPlusscriptDelay",LoadPlusscriptDelay);

        $("#WSPlus_Preferences").modal("hide");
    });
    $("#but_Plus_Preferences_Test").on("click", function (e) {
        console.log ("===ADDscript multiple-select@1.5.2");
        GM_addElement('link', {
            href: 'https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.js',
            rel:"stylesheet"
        });
    });



setTimeout(() =>LoadPlusscript("TimeStat"),LoadPlusscriptDelay);
}

function LoadPlusscript(Statfn){

    if (PlusStat){ console.log ('PlusStat2'); return false;}
    console.log ("PlusScriptStat==>",Statfn, new Date());
    PlusStat=true;

    $("#work_sheets_datatable_length select").val(500).change();

    /*
    GM_addElement('script', {
        src: 'https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.js',
        type: 'text/javascript'
    });



    document.head.appendChild(cssElement(GM_getResourceURL ("bootstrap_select_css")));
    */

    // alert(collg6.length)
    //alert(collg6[1].innerHTML)
    //var MdLYR03Head = document.getElementsByClassName("MdLYR03Head")[0];
    //alert(collg6[1].innerHTML)

    // alert(document.cookie); // cookie1=value1; cookie2=value2;
    // addButton2("測試Cookie",testCookieBut,collg6);

    var SessionObj=[];
    if( Array.isArray( Session.get("Test_e"))){
        SessionObj=Session.get("Test_e");
    }
    if (SessionObj.length>0){
        showSnack("Session內有"+SessionObj.length+"筆資料", "info");
        updateSessionBut();
    }
    var collg6 = document.getElementsByClassName("col-lg-6")[1];


    /*
    collg6.insertAdjacentHTML("beforeend","<hr>");
    addButton("",'<i class="fas fa-check-square"></i> 全選',AddAllBut,"btn-outline-danger");
    collg6.insertAdjacentHTML("beforeend"," ");
    addButton("but_setSession",'<i class="fas fa-upload"></i> 讀取 ',setSession,"btn-primary")
    document.getElementById("but_setSession").insertAdjacentHTML("beforeend","<span id='Sessionlength'  class='wait_amt'>" + SessionObj.length + "</span>");
    collg6.insertAdjacentHTML("beforeend"," ");
    addButton("",'<i class="fas fa-window-close"></i> 清除',clearSession,"btn-outline-dark");
*/

    var PlusThemes=heredoc(function(){/*
	<div class="form-row">
		<div class="col-sm-12 align-right">
			<button type="button" class="btn btn-dark" data-toggle="modal" data-target="#worksheetModal"><i class="fas fa-box-open"></i> 待處理 <span class="wait_amt">0</span></button>
			<button type="submit" class="btn btn-info"><i class="fa fa-search"></i> 搜尋工單</button>
		</div>
	</div>
	<div class="form-row">
		<div class="col-sm-12">
			<hr>
		</div>
	</div>
	<div class="form-row">
		<div class="col-sm-12 col-md-6">
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text" for="group4">區選擇</span>
				</div>
				<select id="group4" multiple="multiple" data-width="100" class="multiple-select form-control" >
					<optgroup label="其他區域">
						<option value="013 P">013 P</option>
						<option value="006 P 1">006 P 1</option>
						<option value="007 G">007 G</option>
						<option value="008 H">008 H</option>
						<option value="002 B">002 B</option>
						<option value="016 T">016 T</option>
						<option value="005 E">005 E</option>
						<option value="HC009 HC-桃竹區外(桃)">HC009 HC-桃竹區外(桃)</option>
					</optgroup>
					<optgroup label="Ｋ　Ｏ　Ｓ">
						<option value="010 K">010 K</option>
						<option value="012 O">012 O</option>
						<option value="015 S">015 S</option>
					</optgroup>
					<optgroup label="Ｃ　Ｍ">
						<option value="003 C">003 C</option>
						<option value="011 M">011 M</option>
					</optgroup>
					<optgroup label="Ａ　Ｊ　Ｌ">
						<option value="001 A">001 A</option>
						<option value="009 J">009 J</option>
						<option value="017 L">017 L</option>
					</optgroup>
				</select>

				</select>
				<div class="input-group-append">
					<button id="but_SelectServernode" class="btn btn-outline-warning" for="group4" type="button" id="button-addon2"><i class="fas fa-check-square"></i> 選擇</button>
				</div>
			</div>
		</div>
		<div class="col-sm-12 col-md-6 align-right">

			<button id="but_AddAllBut" type="button" class="btn btn-outline-danger"><i class="fas fa-check-square"></i> 全選</button>
			<button id="but_setSession" type="button" class="btn btn-primary"><i class="fas fa-upload"></i> 讀取 <span id="Sessionlength" class="wait_amt">0</span></button>
			<button id="but_clearSession" type="button" class="btn btn-outline-dark"><i class="fas fa-window-close"></i> 清除</button>
		</div>
	</div>
      */});



    document.getElementsByClassName("col-lg-6")[1].innerHTML=PlusThemes;
    collg6.className="col-sm-12 col-md-6"
     $("#group4").parent().hide();

    clearSession();
    setSession();
    AddAllBut();
    selcetService();

    setTimeout(() =>work_sheets_datatable_processing(),1000);

    (function() {
        var ev = new $.Event('style'),
            orig = $.fn.css;
        $.fn.css = function() {
            $(this).trigger(ev);
            return orig.apply(this, arguments);
        }
    })();

    $("#work_sheets_datatable_processing").bind('style', function(e) {
        console.log($(this).attr('style')  );

        if($(this).attr('style')=="display: block;" ){
            But_ShowServiceNode();
            Set_worksheet_Plus();
            // Set_dispatch_all_Plus();
        }

    });
}





//載入程序
function work_sheets_datatable_processing(){

    if (document.getElementById("work_sheets_datatable_processing")==null){
        console.log("==Err work_sheets_datatable_processing is null");
        return false;
    }

    if (getStyle(document.getElementById("work_sheets_datatable_processing"),"display")=="block"){
        var timeoutID = window.setTimeout(( () => work_sheets_datatable_processing() ), 1000);
    }else{
        //等待過後執行：

        //設定顯示數量
        //$("head").append("<script>" + GM_getResourceText("bootstrap_select") + "</script>");
        // var Test=GM_getResourceText("bootstrap_select");

        Set_worksheet_Plus();
        Set_dispatch_all_Plus();
        F_name();
        F_Servicegroup();
        ShowSelcetListDiv_Hide();

    }
}


//選擇區域
function selcetService() {

    $("#group4").parent().fadeIn(1000);
    $('#group4').multipleSelect({
        showClear: true,
        formatSelectAll: function () {
            return '全選'
        },
        styler: function (row) {
            if (row.type === 'optgroup') {
                 return 'background-color: #707B7C;color: #FDFEFE; font-weight: normal;'
            }
        }
    })


    $("#but_SelectServernode").on("click", function (e) {
        console.log($("#group4").val());

        var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");
        var work_sheets_tbody=work_sheets_datatable_wrapper.getElementsByTagName("tbody");
        var work_sheets_tbody_TR=work_sheets_tbody[0].getElementsByTagName("tr");

        if (worksheetoptionbutton.length==0){return false;}

        for (var i=0;i<work_sheets_tbody_TR.length;i++){
            if ($("#group4").val().indexOf(work_sheets_tbody_TR[i].getElementsByClassName("ServiceNode")[0].innerText)>-1){
                add_worksheet_Plus(work_sheets_tbody_TR[i].getElementsByClassName("worksheet-option-button")[0]);
            }
        }

    });

}

//隱藏顯示內容功能
function ShowSelcetListDiv_Hide() {
    // document.getElementsByClassName("modal-footer")[1].insertAdjacentHTML("afterbegin", '<input class="form-control" type="text" id="fName" value="">');
    $(".card-header").parent().children(".card-body").hide(500);
    $(".card-header").on("click", function (e) {
        $(".card-header").parent().children(".card-body").toggle(500);
    });
}

//區域快篩功能
function F_Servicegroup()
{
    var SelectGP3=heredoc(function(){/*
	<div class="col-sm-12 col-md-3 col-xl-3">
		<select id="group3"  data-width="200" multiple="multiple" class="form-control">
			<optgroup label="其他區域">
				<option value="013 P">013 P</option>
				<option value="006 P 1">006 P 1</option>
				<option value="007 G">007 G</option>
				<option value="008 H">008 H</option>
				<option value="002 B">002 B</option>
				<option value="016 T">016 T</option>
				<option value="005 E">005 E</option>
				<option value="HC009 HC-桃竹區外(桃)">HC009 HC-桃竹區外(桃)</option>
            </optgroup>
			<optgroup label="Ｋ　Ｏ　Ｓ">
				<option value="010 K">010 K</option>
				<option value="012 O">012 O</option>
				<option value="015 S">015 S</option>
			</optgroup>
            <optgroup label="Ｃ　Ｍ">
				<option value="003 C">003 C</option>
				<option value="011 M">011 M</option>
			</optgroup>
            <optgroup label="Ａ　Ｊ　Ｌ">
				<option value="001 A">001 A</option>
				<option value="009 J">009 J</option>
				<option value="017 L">017 L</option>
			</optgroup>
		</select>
	</div>
      */});

    var work_sheets_datatable_length_col=$(document.getElementById("work_sheets_datatable_length")).parent();
    var work_sheets_datatable_filter_col=$(document.getElementById("work_sheets_datatable_filter")).parent();
    work_sheets_datatable_length_col[0].className="col-sm-12 col-md-6 col-xl-7"

    work_sheets_datatable_filter_col[0].className="col-sm-12 col-md-2 col-xl-2"
    work_sheets_datatable_filter_col[0].insertAdjacentHTML("beforebegin",SelectGP3);


    $("#group3").parent().hide();
    $("#group3").parent().fadeIn(1000);

    $('#group3').multipleSelect({
        showClear: true,
        formatSelectAll: function () {
            return '全選'
        },
        styler: function (row) {
            if (row.type === 'optgroup') {
                return 'background-color: #707B7C;color: #FDFEFE; font-weight: normal;'
            }
        }
    })


    $("#group3").on("change", function (e) {
        console.log($("#group3").val());

        var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");
        var work_sheets_tbody=work_sheets_datatable_wrapper.getElementsByTagName("tbody");
        var work_sheets_tbody_TR=work_sheets_tbody[0].getElementsByTagName("tr");

        if (worksheetoptionbutton.length==0){return false;}
        for (var i=0;i<work_sheets_tbody_TR.length;i++){
            if ($("#group3").val().indexOf(work_sheets_tbody_TR[i].getElementsByClassName("ServiceNode")[0].innerText)>-1 || $("#group3").val()[0]==""|| $("#group3").val()==""){
                work_sheets_tbody_TR[i].style.display = '';
            }else{
                work_sheets_tbody_TR[i].style.display = 'none';
            }
        }
    });

}


//人員快篩
function F_name() {
    document.getElementsByClassName("modal-footer")[1].insertAdjacentHTML("afterbegin", '<input class="form-control" type="text" id="fName" value="">');
    $("#fName").on("input", function (e) {
        //console.log( );
        // var testA=[...document.getElementById("group0").getElementsByTagName("label")];
        //var result = testA.filter(word => word.innerText.indexOf($("#fName").val())>-1);
        var NameList= document.getElementById("group0").getElementsByTagName("label");
        /*
        if ($("#fName").val()=="") {

            for (var c=1;c<NameList.length;i++){
                    NameList[c].style.display = 'block';
            }
            return false
        }
        */
        if (document.getElementById("group0").innerText.indexOf($("#fName").val())==-1)  {return false;}
        for (var i=1;i<NameList.length;i++){

            if (NameList[i].innerText.indexOf($("#fName").val())==-1){
                NameList[i].style.display = 'none';
            }else{
                NameList[i].style.display = '';
            }
        }

    });
}

//選擇區域
function But_SelectServernode() {
    /*

    if (document.getElementById("group").value==''){
        showSnack("請選擇區域", "error");
        return false;
    }

    var work_sheets_datatable_wrapper=document.getElementById("work_sheets_datatable_wrapper")
    var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");
    var work_sheets_tbody=work_sheets_datatable_wrapper.getElementsByTagName("tbody");
    var work_sheets_tbody_TR=work_sheets_tbody[0].getElementsByTagName("tr");

    if (worksheetoptionbutton.length==0){return false;}

    if(document.getElementsByClassName("ServiceNode").length==0) {
        var tt=  But_ShowServiceNode();
    }


    for (var i=0;i<work_sheets_tbody_TR.length;i++){
        if (work_sheets_tbody_TR[i].getElementsByClassName("ServiceNode")[0].innerText==document.getElementById("group").value){
            add_worksheet_Plus(work_sheets_tbody_TR[i].getElementsByClassName("worksheet-option-button")[0])
        }

    }
    */
}



//替代指派功能
function Set_dispatch_all_Plus() {
    var els = document.getElementsByClassName("btn btn-info");

    Array.prototype.forEach.call(els, function(el) {
        console.log(el.toString())

        if (el.onclick!=null){
            if (el.onclick.toString().indexOf("dispatch_all")>0){
                el.onclick= function(e){dispatch_all_Plus(this);}
                //showSnack("Set_dispatch_all_Plus=True", "info");
            }
        }
    });




}

//替代勾選功能
function Set_worksheet_Plus() {



    var work_sheets_datatable_wrapper=document.getElementById("work_sheets_datatable_wrapper")
    var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");

    if (worksheetoptionbutton.length>0){
        for (var i=0;i<worksheetoptionbutton.length;i++){
            worksheetoptionbutton[i].onclick = function(e){add_worksheet_Plus(this);}
            //console.log("Set_worksheet_Plus"+i);
        }
    }
}

//SessionBut
function updateSessionBut(){
    var SessionObj=[];

    if( Array.isArray( Session.get("Test_e"))){
        SessionObj=Session.get("Test_e");
    }

    setTimeout( () =>document.getElementById("Sessionlength").innerHTML= SessionObj.length,50)

}

function clearSession() {
    $("#but_clearSession").on("click", function (e) {
        Session.clear();
        updateSessionBut();
        showSnack("Session清空", "info");
    });
}


function add_worksheet_Plus(e) {

    var component = $(e);
    var so = component.data("company");
    var ws = component.data("id");
    var status = component.data("status");
    var amt = component.data("amt");
    var name = component.data("title");

    var SessionObj=[];

    if( Array.isArray( Session.get("Test_e"))){
        SessionObj=Session.get("Test_e");
    }


    var result = SessionObj.filter(word => word.ws ==ws);
    if(result.length>0){
        //showSnack("工單已選擇", "error");
        console.log("Session is true")
    }else{
        SessionObj.push({so:so,ws:ws,status:status,amt:amt,name:name})
        Session.set("Test_e",SessionObj)
    }


    console.log("ADD Session"+SessionObj.length)
    updateSessionBut();

    add_worksheet(e);
}



function Add01But() {
    var work_sheets_datatable_wrapper=document.getElementById("work_sheets_datatable_wrapper")
    var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");
    add_worksheet_Plus(worksheetoptionbutton[1]);
}



function setSession() {



    $("#but_setSession").on("click", function (e) {
        console.log( Session.dump())

        var SessionObj=[]
        if( Array.isArray( Session.get("Test_e"))){
            SessionObj=Session.get("Test_e");
        }

        if (SessionObj.length==0) return false;

        for (var i=0;i<SessionObj.length;i++){
            console.log(SessionObj[i]);

            var so = SessionObj[i].so;
            var ws = SessionObj[i].ws;
            var status = SessionObj[i].status;
            var amt =SessionObj[i].amt;
            var name = SessionObj[i].name;

            if ($(".select-worksheet[data-id='" + ws + "']").length == 0) {
                var container =
                    '<div class="alert alert-warning alert-dismissible fade show select-worksheet" role="alert" data-id="' +
                    ws +
                    '" data-company="' +
                    so +
                    '"><strong>' +
                    ws +
                    "</strong><br>" +
                    name +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="reduce_amt();toggleTable(&quot;' +
                    ws +
                    '&quot;);">' +
                    '<span aria-hidden="true">&times;</span>' +
                    "</button>" +
                    "</div>";

                $("#worksheet_ready").append(container);
                showSnack("工單" + ws + "已加入", "info");
                plus_amt();
            } else {
                showSnack("工單已選擇", "error");
            }
        }
    });


}






function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
}

function AddAllBut() {

    $("#but_AddAllBut").on("click", function (e) {

        var work_sheets_datatable_wrapper=document.getElementById("work_sheets_datatable_wrapper")
        var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");

        if (worksheetoptionbutton.length>0){
            for (var i=0;i<worksheetoptionbutton.length;i++){
                //add_worksheet(worksheetoptionbutton[i]);
                //worksheetoptionbutton[i].onclick = add_worksheet_Test

                if ($(worksheetoptionbutton[i]).parent().parent().parent().css('display') != 'none'){
                    add_worksheet_Plus(worksheetoptionbutton[i]);
                }

            }
        }
    });
}



function testCookieBut() {


    var work_sheets_datatable_wrapper=document.getElementById("work_sheets_datatable_wrapper")
    var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");

    if (worksheetoptionbutton.length>0){
        for (var i=0;i<worksheetoptionbutton.length;i++){
            // add_worksheet(worksheetoptionbutton[i])
            document.cookie = 'cookie3='+worksheetoptionbutton[i];
            var component = $(worksheetoptionbutton[i]);
            var parent = component.parent().parent().parent();
            var so = component.data("company");
            var ws = component.data("id");
            var status = component.data("status");
            var amt = component.data("amt");
            var name = component.data("title");
            console.log(parent)
            console.log(so)
            console.log(ws)
            console.log(status)
            console.log(amt)
            console.log(name)

        }
    }


    //  console.log(document.cookie); // cookie1=value1; cookie2=value2; cookie3=value3;
}
function But_ShowServiceNode() {


    var work_sheets_datatable_wrapper=document.getElementById("work_sheets_datatable_wrapper")
    var worksheetoptionbutton=work_sheets_datatable_wrapper.getElementsByClassName("worksheet-option-button");

    var work_sheets_tbody=work_sheets_datatable_wrapper.getElementsByTagName("tbody");
    var work_sheets_tbody_TR=work_sheets_tbody[0].getElementsByTagName("tr");

    if (worksheetoptionbutton.length<=0){return false;}
    //var WsDtda=GetWsdatra();

    var WsDtda=unsafeWindow.LaravelDataTables["work_sheets_datatable"].context[0].aoData;

    //window.LaravelDataTables["work_sheets_datatable"].context[0].aoData[8]._aData.servname

    for (var i=0;i<worksheetoptionbutton.length;i++){
        //console.log(i)


        var work_sheets_tbody_Td=work_sheets_tbody_TR[i].getElementsByTagName("td");

        var component = $(worksheetoptionbutton[i]);
        var id = component.data("id");
        var result = WsDtda.filter(word => word._aData.worksheet ==id);




        //console.log(result[0]._aData)

        work_sheets_tbody_Td[1].innerHTML="<b><font class='ServiceNode' color=red>"+result[0]._aData.servname+"</font></b><br>"+result[0]._aData.servicelist;

    }


}

function GetWsdatra() {
    var WsDtda;
    $.ajax({
        async: false,
        type: "get",
        url: "/admin/work_sheets"+location.search,
        cache:true,
        data: {},
        success: function (result) {
            WsDtda=result;
        },
    });
    return WsDtda
}

function checkblockade() {

    var MdLYR01BoxX = document.getElementsByClassName("MdLYR01Box")[1];
    var Testtableid_mdBtn05Txt=MdLYR01BoxX.getElementsByClassName("mdBtn05Txt");
    var Testtableid_mdLYR08Img=MdLYR01BoxX.getElementsByClassName("mdLYR08Img");






    // alert(Testtableid_mdBtn05Txt.length);
    // alert(Testtableid_mdLYR08Shadow.length);

    var FLis;
    $.ajax({
        async: false,
        type: "get",
        url: "/api/present/friends/zh-Hant",
        data: {
        },
        success: function (result) { FLis=result; }
    });

    // i=0

    //alert ()


    for (var i=0;i<Testtableid_mdBtn05Txt.length;i++){
        var result = FLis.filter(word => word.imageUrl ==Testtableid_mdLYR08Img[i].getElementsByTagName("img")[0].src);
        if(result.length>0){
            sjf(Testtableid_mdBtn05Txt,i,result[0].midCrypted)
        }else{
            // alert (Testtableid_mdLYR08Img[i].getElementsByTagName("img")[0].src)
            Testtableid_mdBtn05Txt[i].innerHTML="無法確認";
        }

        //

    }

}

function addButton(id,text,onclick,btnclass){

    // cssObj = cssObj || {position: 'relative','z-index': 3 ,width:'100px',height:'30px'}
    let button = document.createElement('button'), btnStyle = button.style

    // var collg6 = document.getElementsByClassName("col-lg-6")[1];
    var collg6 = document.getElementsByClassName("col-lg-6")[1];


    if (text=="選擇區域"){
        collg6 = document.getElementsByClassName("col-lg-6")[0];
    }

    collg6.appendChild(button)
    //document.getElementById("Mydiv").appendChild(button)

    if (id!="")button.id=id;
    button.innerHTML = text;
    button.onclick = onclick;
    button.type="button"
    button.classList.add("btn");
    if (btnclass==undefined){
        button.classList.add("btn-dark");
    }else{
        button.classList.add(btnclass);
    }

    //Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
    return button

}

function addButton2(id,text, onclick,appendChildD, cssObj) {


    cssObj = cssObj || {
        'float': 'left',
        "background-color": '#4CAF50',
        'color': 'white',
        'padding': '6px 7px',
        'text-align': 'center',
        'font-size': '16px',
        'background-color': 'white',
        'color': 'black',
        'border': '1px solid #4CAF50',
        ':hover':'{background: yellow}'

    }
    let button = document.createElement('a'), btnStyle = button.style


    appendChildD.appendChild(button)

    //document.getElementById("Mydiv").appendChild(button)
    button.id=id
    button.innerHTML = text
    button.onclick = onclick
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
    return button

}






function getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}



if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function() {

    // cache window 物件
    var win = window.top || window;

    // 將資料都存入 window.name 這個 property
    var store = (win.name ? JSON.parse(win.name) : {});

    // 將要存入的資料轉成 json 格式
    function Save() {
        win.name = JSON.stringify(store);
    };

    // 在頁面 unload 的時候將資料存入 window.name
    if (window.addEventListener) window.addEventListener("unload", Save, false);
    else if (window.attachEvent) window.attachEvent("onunload", Save);
    else window.onunload = Save;

    // public methods
    return {

        // 設定一個 session 變數
        set: function(name, value) {
            store[name] = value;
        },

        // 列出指定的 session 資料
        get: function(name) {
            return (store[name] ? store[name] : undefined);
        },

        // 清除資料 ( session )
        clear: function() { store = {}; },

        // 列出所有存入的資料
        dump: function() { return JSON.stringify(store); }

    };

})();

function dispatch_all_PlusXX() {
    var dispatch_worker = [];
    var dispatch_worksheet = [];
    $(".select-worksheet").each(function () {
        var component = $(this);
        dispatch_worksheet.push(
            component.data("company") + "_" + component.data("id")
        );
    });


    $(".worker").each(function () {
        var component = $(this);
        if (
            component.prop("checked") &&
            dispatch_worker.indexOf(component.val()) === -1
        ) {
            dispatch_worker.push(component.val());
        }
    });
    // note: jQuery's filter params are opposite of javascript's native implementation :(
    if (dispatch_worksheet.length > 0 && dispatch_worker.length > 0) {



        var activetr=[...document.getElementById("work_sheets_datatable_wrapper").querySelectorAll(".active")].filter(word => word.tagName =="TR");

        for (var i=0;i<activetr.length;i++){
            $(activetr[i]).remove();
        }

        clearSession();
        $("tr").removeClass("active");
        $(".wait_amt").html(0);
        $(".select-worksheet").remove();
        $("#workerModal").modal("toggle");
        showSnack("派工完成" + response.errmsg, "info");



    } else {
        showSnack("資料不齊全請重新選擇XX", "error");
    }
}
function dispatch_all_Plus() {

    console.log("dispatch_all_Plus");
    var dispatch_worker = [];
    var dispatch_worksheet = [];
    $(".select-worksheet").each(function () {
        var component = $(this);
        dispatch_worksheet.push(
            component.data("company") + "_" + component.data("id")
        );
    });


    $(".worker").each(function () {
        var component = $(this);
        if (
            component.prop("checked") &&
            dispatch_worker.indexOf(component.val()) === -1
        ) {
            dispatch_worker.push(component.val());
        }
    });
    // note: jQuery's filter params are opposite of javascript's native implementation :(
    if (dispatch_worksheet.length > 0 && dispatch_worker.length > 0) {
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            url: "/dispatch_worksheet",
            type: "post",
            dataType: "json",
            data: {
                worksheet: dispatch_worksheet,
                worker: $.unique(dispatch_worker),
            },
            success: function (response) {
                if (response.result == 0) {
                    //=================Puls Function======
                    var activetr=[...document.getElementById("work_sheets_datatable_wrapper").querySelectorAll(".active")].filter(word => word.tagName =="TR");

                    for (var i=0;i<activetr.length;i++){
                        //activetr[i].style.display = 'none'
                        $(activetr[i]).remove();//2021-03-10
                    }
                    clearSession();
                    //=================Puls================

                    $("tr").removeClass("active");
                    $(".wait_amt").html(0);
                    $(".select-worksheet").remove();
                    $("#workerModal").modal("toggle");
                    showSnack("派工完成" + response.errmsg, "info");

                } else {
                    showSnack("派工失敗", "error");
                }
            },
            error: function (xhr, status, error) {
                showSnack("派工失敗", "error");
            },
        });
    } else {
        showSnack("[Pro]資料不齊全請重新選擇", "error");
    }
}

function cssElement(url) {
    var link = document.createElement("link");
    link.href = url;
    link.rel="stylesheet";
    link.type="text/css";
    return link;
}
function heredoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n')
}



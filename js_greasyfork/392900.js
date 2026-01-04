// ==UserScript==
// @name         Tool(2020)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  try to take over the world!
// @author       MR WOLF
// @include      *://*.e-sim.org/*
// @match        *://*.e-sim.org/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/392900/Tool%282020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392900/Tool%282020%29.meta.js
// ==/UserScript==

(function() {
    var day = document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
    //   setCookie('name', 'Amigo57');
    //   alert(getCookie('name'));
    $(document).tooltip();
    var speakerId = 0;
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle(`#productivityTable > tbody > tr > td > div:first-child { color: red; font-weight: bold; }`);
    addGlobalStyle(`#productivityTable > tbody > tr > td > div:last-child { color: #009900; font-weight: bold; }`);
    addGlobalStyle(`#productivityTable > tbody > tr:first-child > td { font-size: 11px; }`);
    addGlobalStyle(`#productivityTable {background: #ffffffbf;border-radius: 10px;}`);
    addGlobalStyle(`#main_s1 .datatable {background: #ffffffbf;border-radius: 10px;}`)
    addGlobalStyle(`.changeback { width: 150px;height: 100px;border: 1px solid;border-radius: 0 10px 0 10px;background-size: cover !important;color: white;padding: 0px !important;margin: 4px !important;}`);
    addGlobalStyle(`.scrollbar{float: left;height: 300px;width: 65px;overflow-y: scroll;margin-bottom: 25px;}`);
    addGlobalStyle(`#main::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;float:right}`);
    addGlobalStyle(`#main::-webkit-scrollbar{width: 8px;}`);
    addGlobalStyle(`#main::-webkit-scrollbar-thumb{border-radius: 10px;background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, rgb(122,153,217)),color-stop(0.72, rgb(73,125,189)),color-stop(0.86, rgb(28,58,148)));}`);
    addGlobalStyle(`#left::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;}`);
    addGlobalStyle(`#left::-webkit-scrollbar{width: 8px;}`);
    addGlobalStyle(`#left::-webkit-scrollbar-thumb{border-radius: 10px;background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, rgb(122,153,217)),color-stop(0.72, rgb(73,125,189)),color-stop(0.86, rgb(28,58,148)));}`);
    addGlobalStyle(`#left {display:none;float: left;width: 261px;height: 100%;overflow-y: auto;border-right: 1px solid white;background-color: #02061f7d;}`);
    addGlobalStyle(`#left_mini {z-index:999;display:block;float: left;width: 4%;height: 100%;border-right: 1px solid white;background-color: #02061f7d;position:absolute}`);
    addGlobalStyle(`#main {text-align:center;float: right;width: 738px;height: 100%;/* background-image: url('https://wallpapercave.com/wp/p9MpBZc.jpg'); */}`);
    addGlobalStyle(`#proli {text-align: center;color: white;font-size: 20px;font-style: italic;padding: 5px;border-bottom: 1px solid;}`);
    addGlobalStyle(`.buts {font-family: cursive;;font-weight: normal;text-align: left;width: 100%;height: 30px;background-color: transparent;border: none;color: #eaeaea;}`);
    addGlobalStyle(`.select-but {font-weight: bold; text-align: left; width: 100%; height: 30px; background-color: rgba(220, 201, 45, 0.7); border-right: none; border-left: none; border-image: initial; border-bottom: 1px solid wheat; border-top: 1px solid wheat;}`);
    addGlobalStyle(`#salary {animation: dailyButtonsAnimation 3s infinite linear;background: repeating-linear-gradient(-45deg, #2301e0, #4a67b9 50px, #3b39c1 70px, #fe999b 80px, #331f9e 100px, #463eb7 142px);background-size: 400px 400px;padding: 2px;border-radius: 9px;;width: 50px;padding: 0px;height: 50px;color: aliceblue;position: fixed;top: 50px;left: 9px;border: 1px solid;border-radius: 12px;}}`);
    addGlobalStyle(`#id {width: 100%;height: 100%;background: rgba(0, 0, 0, 0.61);;position: fixed;top: 0;left:0;z-index: 9998;}`);
    addGlobalStyle(`#content {border: 1px solid yellowgreen;background-size: cover;top: 50%;left: 50%;width: 1000px;z-index: 9999;height: 700px;position: fixed;margin-top: -350px;margin-left: -500px;background-image: url(https://images4.alphacoders.com/216/216546.jpg);}`);
    addGlobalStyle(`.mus-default {background: #334192a1;position: absolute;top: 0px;right: 80px;font-size: 20px;width: 40px;text-align: center;border: 1px solid white;border-right: none;border-top: none;color: white;height: 30px;;}`);
    addGlobalStyle(`.mus-select {background: #076960;;position: absolute;top: 0px;right: 80px;font-size: 20px;width: 40px;text-align: center;border: 1px solid white;border-right: none;border-top: none;color: white;height: 30px;;}`);
    addGlobalStyle(`.settings-default {background: #334192a1;position: absolute; top: 0px;right: 40px;font-size: 20px;width: 40px;text-align: center;border: 1px solid white;border-right: none;border-top: none;color: white;border-radius: 0 0 0 0;height: 30px;}`);
    addGlobalStyle(`#close{background: #f44336b3;position:  absolute;top: 0px;right: 0px;font-size: 18px;width: 40px;text-align:  center;border: 1px solid white;border-right:  none;border-top:  none;color:  white;border-radius: 0 0  0 0;height: 30px;}`);
    addGlobalStyle(`.buts:hover{background: rgba(255, 255, 255, 0.24) !important;color:white;font-style: italic;font-weight: bold;}`);
    addGlobalStyle(`.butlar {color: white;border-left: 5px solid yellow !important;text-align: left;width: 100%;height: 30px;background-color: rgba(75, 35, 53, 0.9);border: none;font-family: monospace;font-size: 17px;}`);
    addGlobalStyle(`.settings-select {background: rgba(243, 220, 30, 0.7);position: absolute;top: 0px;right: 50px;font-size: 18px;width: 50px;text-align: center;border: 1px solid white;border-right: none;border-top: none;color: black;border-radius: 0 0 0 0;height: 40px;}`);
    addGlobalStyle(`#iq {background-size: cover;width: 100%;height: 100%;    background-image: url(https://fbcd.co/images/products/99c3d81f6e609a889bb39c2020ca6e7c_resize.jpg);opacity: 0.9;position: fixed;top: 0px;left: 0px;z-index: 9998;}`);
    addGlobalStyle(`#banner {height: 300px;width: 600px;margin-top: 20px;border: 1px solid white;color: white;background: #00000063;border-radius: 20px;}`);
    addGlobalStyle(`.box {margin:5px;width: 190px;height: 140px;float: left;background-color: transparent;border: none;color: white}`);
    addGlobalStyle(`.box:hover {margin:5px;width: 190px;height: 140px;float: left;background: rgba(255, 255, 255, 0.24) !important; ;border-radius: 20px}`);
    addGlobalStyle(`.tools-box {height: 30px;float: right;background: transparent;color: white;border: none;font-size: 16px;}`);
    addGlobalStyle(`#save {height: 30px !important;background: #9a6464a8;color: white;border: 1px solid white;width: 100%;border-radius: 5px;}`);
    addGlobalStyle(`#save:hover{height: 30px !important;background: #3f51b599;color: white;border: 1px solid white;width: 100%;border-radius: 5px;font-weight: bold;font-size: 17px;}`);
    addGlobalStyle(`.storage{background:none repeat scroll 0 0 #3d6571;border:1px solid #333;margin:0 2px 15px;box-shadow:0 0 1px rgba(0,180,255,0.2);-moz-box-shadow:0 0 1px rgba(0,180,255,0.2);-o-box-shadow:0 0 1px rgba(0,180,255,0.2);-webkit-box-shadow:0 0 1px rgba(0,180,255,0.2);border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;float:left}`);
    addGlobalStyle(`.storage>div:first-child{background:transparent;border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;color:white;font-weight:bold;height:15px;line-height:14px;text-align:center;text-shadow:1px 1px 2px black;width:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2){background:url("../img/stripes.png") repeat scroll 0 0 #3d6571;border-top:1px solid #333;box-shadow:0 0 15px #555 inset;-webkit-box-shadow:0 0 15px #555 inset;-o-box-shadow:0 0 15px #555 inset;-moz-box-shadow:0 0 15px #555 inset;width:52px;height:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2):hover{background-color:#2c90b2}`);
    addGlobalStyle(`.storage>div>img:last-child{position:relative;top:-9px;border-top:1px solid #333;background:#3d6571}.`);
    addGlobalStyle(`.storage>div>img:first-child{width:40px;height:40px;background:none!important;border:0;margin:6px;position:static;border-top:0}`);
    addGlobalStyle(`.storage{background:none repeat scroll 0 0 #3d6571;border:1px solid #333;margin:0 2px 15px;box-shadow:0 0 1px rgba(0,180,255,0.2);-moz-box-shadow:0 0 1px rgba(0,180,255,0.2);-o-box-shadow:0 0 1px rgba(0,180,255,0.2);-webkit-box-shadow:0 0 1px rgba(0,180,255,0.2);border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;float:left}`);
    addGlobalStyle(`.storage>div:nth-child(2){background:url("../img/stripes.png") repeat scroll 0 0 #3d6571;border-top:1px solid #333;box-shadow:0 0 15px #555 inset;-webkit-box-shadow:0 0 15px #555 inset;-o-box-shadow:0 0 15px #555 inset;-moz-box-shadow:0 0 15px #555 inset;width:52px;height:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2):hover{background-color:#2c90b2}`);
    addGlobalStyle(`.storage>div>img:last-child{position:relative;top:-9px;border-top:1px solid #333;background:#3d6571}`);
    addGlobalStyle(`.storage>div>img:first-child{width:40px;height:40px;background:none!important;border:0;margin:6px;position:static;border-top:0}`);
    addGlobalStyle(`.currencyDiv {background-color: #111;border: 2px solid #036;display: table-cell;float: left;height: 24px;margin: 4px;padding: 12px 0;width: 178px;}`);
    addGlobalStyle(`.highAmount {border: 2px solid #048 !important;}`);
    addGlobalStyle(`.lowAmount {border: 2px solid #024 !important;}`);
    addGlobalStyle(`.worker_but {background: blueviolet;height: 20px;padding: 2px 10px 2px 10px !important;border: 1px solid white;border-radius: 0 10px 0 10px;color: white;}`);
    addGlobalStyle(`#worker_panel_add {color: white;text-align: center;border: 1px solid yellowgreen;border-radius: 0 0 30px 40px;background-size: contain;top: 50%;left: 50%;width: 300px;z-index: 9999;height: 296px;position: fixed;margin-top: -148px;margin-left: -150px;background: #101923;}`);
    addGlobalStyle(`.get_CMP {border: 1px solid;border-radius: 5px;background: transparent;color: white;}`);
    //  addGlobalStyle(`#main table tr:first-child td {background-color: rebeccapurple;}`);
    addGlobalStyle(`#countryId {width: -webkit-fill-available;background: #00008b9e;color: white;font-size: 18px;font-style: italic;height: 30px;text-align-last: center;}`);
    addGlobalStyle(`#left_mini_content  .label {float: right;color:white;font-size: 15px;}`);
    addGlobalStyle(`#left_mini_content .data {float: left;color:white;font-size: 15px;}`);
    addGlobalStyle(`#left_mini_content .profile-row {border-top: 1px solid #8bb4c0;box-sizing: border-box;margin: 0 !important;min-height: 2.5em !important;padding: 5px 15px;}`);
    addGlobalStyle(`#preview {text-align: -webkit-center;}`);
    addGlobalStyle(`.darkTable {color:white;}`);
    addGlobalStyle(`#netem {color: black;font-size: 20px;font-style: italic;}`);
    addGlobalStyle(`.testDivblue option{background: transparent !important;}`);
    addGlobalStyle(`#netem .cat_len {width: inherit !important; }`);
    addGlobalStyle(`#main_s2 .paddedTable tr td {padding: 0px !important;}`)
    addGlobalStyle(`#drop {font-family: cursive;background-repeat: no-repeat;background-size: 80px 50px;}`)
    addGlobalStyle(`#main_s2 .paddedTable {    width: 700px !important;}`)
    addGlobalStyle(`#main_s #productivityTable {width: 710px !important;}`)
    addGlobalStyle(`#ref_com_id {background: #a21a1a;color: white;border: 1px solid;border-radius: 5px;}`)
    addGlobalStyle(`[type="file"] {height: 0;overflow: hidden;width: 0;}`)
    addGlobalStyle(`[type="file"] + label {
  background: #f15d22;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
	font-family: 'Rubik', sans-serif;
	font-size: inherit;
  font-weight: 500;
  margin-bottom: 1rem;
  outline: none;
  padding: 1rem 50px;
  position: relative;
  transition: all 0.3s;
  vertical-align: middle;

  &:hover {
    background-color: darken(#f15d22, 10%);
  }`)



    if (window.location.href.indexOf("company.html?id=") > -1) {
        $( ".whiteCompanyData" ).append( "<div style='margin: 5px;'><button id='add_como' style='width: -webkit-fill-available;height: 25px;background: blue;color: white;border: 1px solid white;border-radius: 5px;'>ADD COMPANY</button></div>" );
        document.getElementById("add_como").onclick = function(){
            //alert( $( "#companyPreview" ).find( "a" ).text())
            $.cookie.json = true;

            var cat_o = $.cookie("categories")
            //       alert(JSON.stringify($.cookie("categories")));
            var cat_ms = cat_o.includes("Default");
            if(cat_ms){}else{
                cat_o.push('Default');
                //        alert(JSON.stringify(cat_o));
                $.cookie("categories", cat_o , { expires : 30 });
            }
            var com_o
            var url_com = window.location.href;
            var id_com = url_com.substring(url_com.lastIndexOf('=') + 1);
            $.cookie.json = true;
            if($.cookie('companies') === null || $.cookie('companies') === "")
            {
                //no cookie
                com_o = []
            }
            else
            {
                //have cookie
                com_o = $.cookie("companies");
                for (var i = 0; i < com_o.length; i++){
                    if (com_o[i][1] ==  id_com){
                        $('#citizenMessage').showTopbarMessage({background: "#0a3"});
                        $("#container").append("<div class=\"actionStatus\" id=\"actionStatusDiv\""
                                               + "style=\"position: fixed; left: 50px; bottom: 50px; width: 250px; height: auto; font-size: 18px; "
                                               + "background-color:  rgba(204, 0, 0, 0.8); "
                                               + "border:2px solid #d3d3d3; border-radius: 10px; text-align: center; padding: 16px;\" onclick=\"hideActionStatus(this.id)\"> "
                                               + "<p style=\"color: white;\"> Company already registered </div>");
                        location.reload()
                        return
                    }
                }
            }
            com_o.push(["Default",id_com,$( ".workRightColEl" ).find( "span" ).attr("title"),$( "#companyPreview" ).find( "a" ).text()]);
            //      alert(JSON.stringify(com_o));
            $.cookie("companies", com_o , { expires : 30 });
            //  alert("done");
            window.close();
            // location.reload();
        };
    }
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() // + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var bute = document.createElement("img");
    bute.id="salary"
    bute.setAttribute("src", "https://suna.e-sim.org:3000/avatars/539294_normal");
    document.getElementById('desktop-navbar').appendChild(bute);
    if (window.location.href.indexOf("profile") > -1) {
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf('=') + 1);
        var worker_But = document.createElement("BUTTON");   // Create a <button> element
        worker_But.innerHTML = "Add Worker"
        worker_But.className= "worker_but";
        worker_But.onclick = function() {
            jQuery('<div/>', {id: 'iq'}).appendTo('body');
            jQuery('<div/>', {id: 'worker_panel_add', html: `<p style="font-size: 14px;padding: 0px !important;">Add Worker</p>
<button style="position: absolute;top: 0;right: 0;background: green;border: none;height: 44px;color: white;font-size: 14px;" onclick="document.getElementById('iq').remove();document.getElementById('worker_panel_add').remove()">Close</button>
<hr>
<table class="bbTable table" style="color:white;width: 100%;"><tbody>
<tr><td>Name</td><td><p id="WorKer_name">NAME</p></td></tr>
<tr><td>Id</td><td><p id="WorKer_ID">ID</p></td></tr>
<tr><td>Company ID</td><td><p id="WorID">Company ID</p></td></tr>
<tr><td>Economical skill</td><td><p id="ecoski">ECO</p></td></tr>
<tr><td>Salary</td><td><input id="Worker_Salary" style="background: transparent;border: none;color: white;" type="number" type="number" min="0" max="100" value="0"></td></tr>
<tr><td><i class="icon-Food"></i> Comune</td><td><input id="comune_food" style="background: transparent;border: none;color: white;" type="number" min="0" max="100" value="0"></td></tr>
<tr><td><i class="icon-Gift"></i> Comune</td><td><input id="comune_gift" style="background: transparent;border: none;color: white;" type="number" min="0" max="100" value="0"></td></tr>
<tr><td><i class="icon-Weapon"></i>Comune</td><td><input id="comune_wep" style="background: transparent;border: none;color: white;" type="number" min="0" max="300" value="0"></td></tr>
</tbody></table>
<button id="WorKer_SaVe" style="width: -webkit-fill-available;margin-top: 15px;hei-ght: 30px;border: none;background: mediumslateblue;color: white;font-size: 18px;">Save</button><br><hr>
Tool created by WolF Flock
`}).appendTo('body');
            $("#worker_panel_add").draggable({ containment: "window" });
            document.getElementById("WorKer_name").innerHTML = $(".big-login").text();
            document.getElementById("WorKer_ID").innerHTML = id;
            $.ajax({
                type : "GET",
                url : "/apiCitizenById.html?id=" + id,
                success : function(msg) {
                    var obj = JSON.parse(msg);
                    document.getElementById("WorID").innerHTML = obj.companyId;
                    document.getElementById("WorKer_name").innerHTML = obj.login
                    document.getElementById("ecoski").innerHTML = obj.economySkill
                }
            })
            document.getElementById("WorKer_SaVe").onclick = function() {
                var emp_o
                $.cookie.json = true;
                if($.cookie('employers') === null || $.cookie('employers') === "")
                {
                    //no cookie
                    emp_o = []
                }
                else
                {
                    //have cookie
                    emp_o = $.cookie("employers");
                    for (var i = 0; i < emp_o.length; i++){
                        if (emp_o[i][0] == document.getElementById("WorKer_name").innerHTML){
                            alert(document.getElementById("WorKer_name").innerHTML +` already registered`)
                            location.reload()
                            return
                        }
                    }
                }
                var s_w_ad = $(".big-login").text()
                var s_w_id = document.getElementById("WorID").innerHTML
                var s_w_ec = document.getElementById("ecoski").innerHTML
                var s_w_ec_int = parseInt(s_w_ec)
                var s_w_slr = document.getElementById("Worker_Salary").value
                var s_w_cs_f = document.getElementById("comune_food").value
                var s_w_cs_g = document.getElementById("comune_gift").value
                var s_w_cs_w =document.getElementById("comune_wep").value
                if(s_w_slr === ""){s_w_slr = 0}
                if(s_w_cs_f === ""){s_w_cs_f = 0}
                if(s_w_cs_g === ""){s_w_cs_g = 0}
                if(s_w_cs_w === ""){s_w_cs_w = 0}
                emp_o.push([s_w_ad , id, s_w_id , s_w_ec_int , s_w_slr , s_w_cs_f , s_w_cs_g , s_w_cs_w]);
                //    alert(JSON.stringify(emp_o));
                $.cookie("employers", emp_o , { expires : 30 });
                //  alert("done");
                location.reload();
            };
        };
        document.getElementById("loginBar").appendChild(worker_But);
    }
    document.getElementById("salary").onclick = function () {
        if (!$('#content').length){
            this.disabled = true;
            jQuery('<div/>', {id: 'iq'}).appendTo('body');
            jQuery('<div/>', {id: 'content', html: `<div id="left" class="scrollbar">
<div id="proli">Companies list
</div>
<audio id="audio" preload="auto" src="` + $.cookie('mp3') + `" loop="true" autobuffer>
Unsupported in Firefox
</audio>
<button id="back" class="s buts" style="margin-top:10px;margin-bottom:10px;color: white;border: 1px solid;border-right: none;border-radius: 5px 0px 0px 5px;float: right;width: 180px;"><i class="icon-home"></i>Return to Home page</button>
<div id="drop" style="background-color:#421010c2;display: block;width: 90%;height: 56px;border: 2px dashed white;margin: 8px;margin-top:  3px;float:  left;border-radius:  11px;text-align:  center;font-size:  16px;color:  white;"><p style="width: auto;height: 25px;">Drop here</p>
</div>
</div>
<div id="left_mini">
<button id="home" title="Home page" class="tools-box" style="margin-top: 20px;"><i class="icon-home"></i></button>
<button id="money_a" title="You wallet" class="tools-box" style="margin-top: 20px;"><i class="icon-wallet"></i></button>
<button id="mu_a" title="Military unit members" class="tools-box" style="margin-top: 20px;"><i class="icon-fort"></i></button>
<button id="sal_list" title="Salary list" class="tools-box" style="margin-top: 20px;"><i class="icon-sc"></i></button>
<button id="msg_list" title="messages" class="tools-box" style="margin-top: 20px;"><i class="icon-email2"></i></button>
<button id="lang" title="Supply" class="tools-box" style="margin-top: 20px;"><i class="icon-Gift"></i></button>
<button id="onl" title="Online" class="tools-box" style="margin-top: 20px;"><i class="icon-earth"></i></button>
<div id="left_mini_content" style="text-align: center;"></div>
</div>
</div>
<div id="main" class="scrollbar">

</div>
<button id="aud" title="Music" class="mus-default">♫</button>
<button id="settings" title="Configuration" class="settings-default"><i class="icon-uniF00F"></i></button>
<button id="close" title="Close" onclick="document.getElementById('iq').style.display = 'none';document.getElementById('content').style.display = 'none' ;document.getElementById('salary').disabled=false">X</button>`}).appendTo('body');
            $("#content").draggable({ containment: "window" });
            $("#left_mini").width(260)
            document.getElementById("main").style.width = "738px";
            $("#main").css({"float": "right"});
            var normal = $(".smallAvatar").attr("src")
            normal = (normal.replace('small', 'normal'))
            var url = $('#userName').prop('href');
            var ids = url.substring(url.lastIndexOf('=') + 1);
            $.ajax({
                type : "GET",
                url : "/apiCitizenById.html?id=" + ids,
                success : function(msg) {
                    var obj = JSON.parse(msg);
                    document.getElementById("left_mini_content").innerHTML = `
<img  style="padding: 10px;border: 1px solid white;margin-top: 15px;border-radius: 0px 25px;background: #ffffff1c;" src="` + normal + `">
<div style="font-size: 30px;color: wheat;">` + obj.login + `</div>
<div class="profile-row"><span class="data">Rank :</span><span class="label">` + obj.rank +` </span></div>
<div class="profile-row"><span class="data">Level :</span><span class="label">` + obj.level + `</span></div>
<div class="profile-row"><span class="data">Experience :</span><span class="label">` + obj.xp + `</span></div>
<div class="profile-row"><span class="data">Damage :</span><span class="label">` + obj.totalDamage + `</span></div>
<div class="profile-row"><span class="data">Todays Damage :</span><span class="label">` + obj.damageToday + `</span></div>
<div class="profile-row"><span class="data">Economic skill :</span><span class="label">` + obj.economySkill + `</span></div>
<div class="profile-row"><span class="data">Strengh :</span><span class="label">` + obj.strength + `</span></div>
<div class="profile-row"><span class="data">Citizenship :</span><span class="label"><div class="xflagsSmall xflagsSmall-` + obj.citizenship + `"></div> ` + obj.citizenship + `</span></div>
<div class="profile-row"><span class="data">Premium days :</span><span class="label">` + obj.premiumDays + `</span></div>`
 $("#left_mini").css({"min-width": "260px"});
                }
            });
            document.getElementById("home").onclick = function(){thanks();};
            document.getElementById("back").onclick = function(){thanks();};
            document.getElementById("money_a").onclick = function(){show_money();};
            document.getElementById("mu_a").onclick = function(){var url = $('#userName').prop('href');var ids = url.substring(url.lastIndexOf('=') + 1);show_mu_mem(ids);};
            document.getElementById("sal_list").onclick = function(){salry();};
            document.getElementById("msg_list").onclick = function(){prem_list();};
            document.getElementById("onl").onclick = function() {onl(155)};
            document.getElementById("lang").onclick = function(){languages(ids);};
            thanks();
            if (!!$.cookie('background')) {
                document.getElementById('content').style.backgroundImage = "url('" + $.cookie('background') + "')";
            }
            //types iron; pistol-gun ; grain ; food ; diamond ; gift and others
            document.getElementById("settings").onclick = function() {
                close_left();removecat();
                unselect();
                settings_main();
                document.getElementById("configuration").className="s butlar";
                document.getElementById("settings").className="settings-select";
            };
            document.getElementById("aud").onclick = function() {
                checkCookie(`mp3`,'Please check settings');
                var myAudio = document.getElementById('audio');
                if (myAudio.duration > 0 && !myAudio.paused) {
                    //Its playing...do your job
                    document.getElementById("aud").className="mus-default";
                    myAudio.pause();
                } else {
                    document.getElementById("aud").className="mus-select";
                    myAudio.play();
                }
            };
            companies();
        }else {
            document.getElementById('iq').style.display = 'block';
            document.getElementById('content').style.display = 'block';
        }
    };
    function addcategory(cat_id,title){
        var d=document.createElement('div');
        d.style =`width:100%;font-size: 20px;color: white;font-style: oblique;margin:0px;margin-top: 10px;`;
        d.id= cat_id ;
        d.innerHTML= `</i><p style="clear: both;margin: 5px;">` + title + `</p>` ;
        document.getElementById('left').appendChild(d);
    }
    function addcomp(cat_id,type,id,name){
        var but = document.createElement("button");
        but.innerHTML= `<i class="icon-`+ type + `"></i> ` +  name;
        but.className = "s buts";
        but.onmouseover= function(){
            $(but).draggable({revert: "invalid" , cancel: false,axis: "y"});
            $( "#drop" ).droppable({
                drop: function( event, ui ) {
                    $( this )
                        .find( "p" )
                        .html(`<p style="width: auto;height: 25px;"><span style="background: #00000063;border: none;border-radius: 5px;">`+ but.innerText +`</span></p>`);
                    if(type== "Iron"){$("#drop").css("background-image","url(https://i.ibb.co/Jxc4qqC/iron.png)");}
                    if(type== "Grain"){$("#drop").css("background-image","url(https://i.ibb.co/2Pbm4Lc/grain.png)");}
                    if(type== "Diamonds"){$("#drop").css("background-image","url(https://i.ibb.co/JyfLPJv/diamond.png)");}
                    if(type== "Oil"){$("#drop").css("background-image","url(https://i.ibb.co/B6Fxbfn/Oil.png)");}
                    if(type== "Stone"){$("#drop").css("background-image","https://i.ibb.co/mXTSdhm/stone.png)");}
                    if(type== "Wood"){$("#drop").css("background-image","url(https://i.ibb.co/7Q86vC5/wood.png)");}
                    if(type== "Weapon"){$("#drop").css("background-image","url(https://i.ibb.co/FXzDTq6/gun.png)");}
                    if(type== "Food"){$("#drop").css("background-image","url(https://i.ibb.co/tJLyt5T/bread.png)");}
                    if(type== "Ticket"){$("#drop").css("background-image","url(https://i.ibb.co/NWz5Bn2/ticket.png)");}
                    if(type== "Gift"){$("#drop").css("background-image","url(https://i.ibb.co/QdcQb2L/gift.png)");}
                    if(type== "Hospital"){$("#drop").css("background-image","url(https://i.ibb.co/9WGtMb9/hospital.png)");}
                    if(type== "Home"){$("#drop").css("background-image","url(https://i.ibb.co/xXbJWGf/home.png)");}
                    if(type== "Estate"){$("#drop").css("background-image","url(https://i.ibb.co/nPgR5hp/estate.png)");}
                    $(but).draggable({revert: "valid" , cancel: false,axis: "y"});
                    var ele = document.getElementsByClassName('s');
                    for (var i = 0; i < ele.length; i++ ) {
                        ele[i].className = "s buts";
                    }
                    //       $("#drop").css("background-image","none");
                    but.className="s butlar";
                    get_company(id)
                }
            });

        };
        but.ondblclick = function() {
            //   if(type== "Iron"){$("#drop").addClass("icon-Iron")}
            if(type== "Iron"){$("#drop").css("background-image","url(https://i.ibb.co/Jxc4qqC/iron.png)");}
            if(type== "Grain"){$("#drop").css("background-image","url(https://i.ibb.co/2Pbm4Lc/grain.png)");}
            if(type== "Diamonds"){$("#drop").css("background-image","url(https://i.ibb.co/JyfLPJv/diamond.png)");}
            if(type== "Oil"){$("#drop").css("background-image","url(https://i.ibb.co/B6Fxbfn/Oil.png)");}
            if(type== "Stone"){$("#drop").css("background-image","https://i.ibb.co/mXTSdhm/stone.png)");}
            if(type== "Wood"){$("#drop").css("background-image","url(https://i.ibb.co/7Q86vC5/wood.png)");}
            if(type== "Weapon"){$("#drop").css("background-image","url(https://i.ibb.co/FXzDTq6/gun.png)");}
            if(type== "Food"){$("#drop").css("background-image","url(https://i.ibb.co/tJLyt5T/bread.png)");}
            if(type== "Ticket"){$("#drop").css("background-image","url(https://i.ibb.co/NWz5Bn2/ticket.png)");}
            if(type== "Gift"){$("#drop").css("background-image","url(https://i.ibb.co/QdcQb2L/gift.png)");}
            if(type== "Hospital"){$("#drop").css("background-image","url(https://i.ibb.co/9WGtMb9/hospital.png)");}
            if(type== "Home"){$("#drop").css("background-image","url(https://i.ibb.co/xXbJWGf/home.png)");}
            if(type== "Estate"){$("#drop").css("background-image","url(https://i.ibb.co/nPgR5hp/estate.png)");}
            var ele = document.getElementsByClassName('s');
            for (var i = 0; i < ele.length; i++ ) {
                ele[i].className = "s buts";
            }
            but.className="s butlar";
            $("#drop" ).html(`<p style="width: auto;height: 25px;"><span style="background: #00000063;border: none;border-radius: 5px;">`+ but.innerText +`</span></p>`);
            get_company(id)
        };
        document.getElementById(cat_id).appendChild(but);
        $(but).mouseleave(function() {
            //   $(but).draggable().css("position","relative");
        });
    }
    function unselect(){
        var ele = document.getElementsByClassName('s');
        for (var i = 0; i < ele.length; i++ ) {
            ele[i].className= "s buts";
        }
        document.getElementById("settings").className="settings-default";
    }
    addGlobalStyle(`#main_s .testDivwhite{background: transparent !important;float: none !important;}`);
    addGlobalStyle(`#main_s .testDivblue {background: transparent !important;float: none !important;}`);
    addGlobalStyle(`#main_s1 .testDivwhite{background: transparent !important;float: none !important;}`);
    addGlobalStyle(`#main_s1 .testDivblue {background: transparent !important;float: none !important;}`);
    function message_js(title){
        document.getElementById("main").innerHTML =
            `<center><div id="main_main" style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid; width: fit-content; height: fit-content;">`+ title +`<hr>
<div id="main_s"></div>
<div id="main_s1"></div>
<div id="main_s2"></div>
</div></center>   `;
        $("#main_main").draggable({ containment: "#main" });
    }
    function checkCookie(cname,question) {
        if (!!$.cookie(cname)) {
        } else {
            alert(question);
            settings();}
    }
    function changeback(url){
        var but = document.createElement("button");
        but.style=`background: url('`+ url +`') no-repeat;`;
        but.className = "changeback";
        but.onclick = function() {
            $.cookie('background', url,{ expires : 30 });
            document.getElementById('content').style.backgroundImage = "url('" + url + "')";
        };
        document.getElementById("img_chn").appendChild(but);
    }

    function settings(){
        document.getElementById("main").innerHTML =
            `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 45px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;"><i class="icon-uniF00F"></i> Settings <hr>
<div id="img_chn"></div><hr><i class="icon-uniF00F"></i> Change music <hr> Music :
<input type="file" id="audio_file" />
  <label for="audio_file" />choose a file</label>

<p>
<audio controls id="audio_player"></audio>
</p>
</div></center>   `;
        changeback("https://storge.pic2.me/c/1360x800/206/528140750a7f5.jpg");
        changeback("https://images4.alphacoders.com/216/216546.jpg");
        changeback("https://i.pinimg.com/originals/b4/bd/d0/b4bdd071a02bbff4803b67d86aa7984c.jpg");
        changeback("https://bgfons.com/upload/rainbow_texture679.jpg");
        changeback("https://www.webdesignerdepot.com/cdn-origin/uploads/2013/06/featured48.jpg");
        changeback("https://s3.envato.com/files/222589891/preview_image.jpg");
        //document.getElementById("def_mp3").value = $.cookie('mp3');

        $('#audio_file').on("change", function(){
            var files = this.files;
            var file = URL.createObjectURL(files[0]);
            var vid = document.getElementById("audio_player");
            vid.src = file;
            vid.play();
            $.cookie('mp3', file,{ expires : 30 });
            md_alarm("uniF471",`Dafault music is changed`)
            document.getElementById('audio').src = $.cookie('mp3');
        })     
    }
    function settings_main(){
        document.getElementById("main").innerHTML =
            `<center><div style="color:white;font-size: 20px;color: white;font-style: oblique;margin-top: 45px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;"><i class="icon-uniF00F"></i> Settings <hr>
<div id="set_1" style="text-align:left">Stocks in My account <i class="icon-info" style="font-size:  15px;" title="If you select yes option when you refresh page you may watch stock <b><u>in you acount</u></b>"></i> :
<label>
<input id="set1_yes" type="radio" name="set1_rad" value="Yes">Yes
</label>
<label>
<input id="set1_no" type="radio" name="set1_rad" value="No" checked>No
</label>
</div>
<div id="set_2" style="text-align:left">Stocks in Military Unit <i class="icon-info" style="font-size:  15px;" title="If you select yes option when you refresh page you may watch stock <b><u>in you Military unit</u></b>"></i> :
<label>
<input id="set2_yes" type="radio" name="set2_rad" value="Yes"/>Yes
</label>
<label>
<input id="set2_no" type="radio" name="set2_rad" value="No" checked>No
</label>
</div>
<div id="set_3" style="text-align:left">Stock company storage <i class="icon-info" style="font-size:  15px;" title="If you select yes option when you refresh page you may watch stock <b><u>in you Stock company</u></b>"></i> :
<label>
<input id="set3_yes" type="radio" name="set3_rad" value="Yes"/>Yes
</label>
<label>
<input id="set3_no" type="radio" name="set3_rad" value="No" checked>No
</label>
<input id="stock_id" style="border: 1px solid #333;display:none;width:100px;width: 200px !important;float: right;" type="text" placeholder="Write stock company ID">
</div><hr>
<div id="set_4" style="text-align:left"><span>Add categories <i class="icon-info" style="font-size:  15px;" title="<b>Example :</b><ul style='list-style-type:disc'><li>Military Unit Companies</li><li>ORG companies</li><li>Private Companies</li></ul>"></i>:</span>
<input id="add_category_tex" style="border: 1px solid #333;width: 450px !important;" type="text" placeholder="name"><button id="add_category" style="height: 20px !important;background: #000000a8;color: white;border: 1px solid white;">Add</button>
<div id="set_4_result">Select Category:
</div><hr>
<table id="sal" style="color:white;width: 100%;" class="bbTable table"><tbody><tr><td style="width: 25%;">Category</td><td style="width: 100px;">ID <i class="icon-info" style="font-size:  15px;" title="<b>Example:</b><br>*.e-sim.org/company.html?id=XXX<br>Write XXX to inputbox"></i></td><td style="width:100px">Type <i class="icon-info" style="font-size:  15px;" title="<b>Example:</b><ul style='list-style-type:disc'>
<li><i class='icon-iron'></i> = write <b>iron</b></li>
<li><i class='icon-grain'></i> = write <b>grain</b></li>
<li><i class='icon-oil'></i> = write <b>oil</b></li>
<li><i class='icon-stone'></i> = write <b>stone</b></li>
<li><i class='icon-wood'></i> = write <b>wood</b></li>
<li><i class='icon-diamond'></i> = write <b>grain</b></li>
<li><i class='icon-weapon'></i> = write <b>weapon</b></li>
<li><i class='icon-gift'></i> = write <b>gift</b></li>
<li><i class='icon-food'></i> = write <b>food</b></li>
<li><i class='icon-ticket'></i> = write <b>ticket</b></li>
<li><i class='icon-defense-system'></i> = write <b>defense-system</b></li>
<li><i class='icon-hospital'></i> = write <b>hospital</b></li>
<li><i class='icon-estate'></i> = write <b>estate</b></li>
</ul>"></i></td><td style="width:  40%;">Company Name</td><td style="width:  11%;"></td></tr></tbody></table>
<hr>
<button id="save">Save</button>
</div>

</div></center>   `;
        if($.cookie('stocks')){
            var s_stoks = JSON.parse($.cookie('stocks'));
            if(s_stoks[0]=="1"){
                document.getElementById("set1_yes").checked = true;
            }else{document.getElementById("set1_no").checked = true;}
            if(s_stoks[1]=="1"){
                document.getElementById("set2_yes").checked = true;
            }else{document.getElementById("set2_no").checked = true;}
            if(s_stoks.length == 3){
                document.getElementById("set3_yes").checked = true;
                document.getElementById("stock_id").style.display="block";
                document.getElementById("stock_id").value= s_stoks[2];
            }else{document.getElementById("set3_no").checked = true;}
        }
        document.getElementById('set3_yes').onclick = function(){document.getElementById("stock_id").style.display="block";};
        document.getElementById('set3_no').onclick = function(){document.getElementById("stock_id").style.display="none";};
        document.getElementById("add_category").onclick= function(){
            if(document.getElementById("add_category_tex").value != ''){
                if(!document.getElementById(document.getElementById("add_category_tex").value)){
                    var but = document.createElement("button");
                    but.id= document.getElementById("add_category_tex").value;
                    but.style="background-color: rebeccapurple;color: white;border: 1px solid;margin: 1px;margin-right:0px;border-radius: 5px 0 0 5px;";
                    but.innerHTML= document.getElementById("add_category_tex").value ;
                    but.title="Click button for create company belong to <b>" + document.getElementById("add_category_tex").value + "</b> category";
                    but.className = 'cat_len';
                    but.onclick = function() {
                        insertCmp(`<button class="chn_cat" style="width:100px;background-color: blue;color: white;border: 1px solid;margin: 1px;border-radius:  5px;">`+but.innerHTML+`</button>`,'<input style="border: 1px solid #333;width: 100px;" type="text">','<input style="border: 1px solid #333;;" type="text">','<button title="Set type of copmany possible after save company withoat type" class="icon-Tools" style="border: 0px;width: 100px;background: transparent;color: white">Tools</button>');};
                    document.getElementById('set_4_result').appendChild(but);
                    //      document.getElementById('set_4_result').innerHTML += `<button style="background: darkslategrey;color: white;border: 1px solid white;border-radius: 0 5px 5px 0;" onclick="$('#`+ but.id +`').remove();">x</button>`;
                    var but1 = document.createElement("button");
                    but1.style="background: darkslategrey;color: white;border: 1px solid white;border-radius: 0 5px 5px 0;margin-right: 5px;";
                    but1.innerHTML= 'x';
                    but1.className = 'rev';
                    but1.title="Remove category : <b>" + document.getElementById("add_category_tex").value + "</b>";
                    but1.onclick = function() {
                        deleterow(but.id);
                        but1.remove();
                    };
                    document.getElementById('set_4_result').appendChild(but1);
                }else{

                    md_alarm("alert","This category already exist")

                }
            }else{md_alarm("alert",'Category name cant be null.Please check again');}
        };
        if($.cookie('categories')){
            var s_categories = JSON.parse($.cookie('categories'));
            var s_companies = JSON.parse($.cookie('companies'));
            for (var s = 0, m = s_categories.length; s < m; s++) {
                document.getElementById("add_category_tex").value= s_categories[s];
                $('#add_category')[0].click();
            }
            document.getElementById("add_category_tex").value= '';
            for (var a = 0, n = s_companies.length; a < n; a++) {
                insertCmp(`<button class="chn_cat" style="width:100px;background-color: rebeccapurple;color: white;border: 1px solid;margin: 1px;border-radius:  5px;">`+ s_companies[a][0]  +`</button>`,'<input style="border: 1px solid #333;width: 100px;" type="text" value="'+ s_companies[a][1] +'">','<input style="border: 1px solid #333;" type="text" value="'+ s_companies[a][3] +'">','<button class="chn_typ icon-'+ s_companies[a][2] + '" style="border: 0px;width: 100px;background: transparent;color: white;">'+ s_companies[a][2] + '</button>');
            }
            $(".chn_cat").click(function(){
                $("#netice").remove()
                $(this).addClass("sec")
                $( "#main" ).append('<div style="position: absolute;top: 0;background: #050505b5;height: inherit;width: inherit;" id="netice"><div style="position: absolute;background: url(https://cdn.e-sim.org//img/lowPolyBg.jpg);width: 220px;top: 200px;left: 230px;border: 1px solid white;padding: 5px;border-radius: 5px;color: wheat;" id="netem">' + $( "#set_4_result" ).html() + '</div>></div>');
                $( "#netice .rev").remove();
                $("#netice" ).click(function() {$("#netice" ).remove();$(".sec").removeClass("sec")})

                $( "#netice button").click(function(){
                    $(".sec").text($(this).text())
                    $(".sec").removeClass("sec")
                    $("#netice").remove()
                }
                                          )
            });

            $(".chn_typ").click(function(){
                $("#netice").remove()
                $(this).addClass("sec")
                $(".sec").removeClass("icon-"+$(this).text());
                $( "#main" ).append(`<div style="position: absolute;top: 0;background: #050505b5;height: inherit;width: inherit;" id="netice"><div style="position: absolute;background: url(https://cdn.e-sim.org//img/lowPolyBg.jpg);top: 200px;left: 230px;color:white;border: 1px solid;border-radius: 10px;padding: 5px;width: 220px;" id="netem">

<table class="darktable">
	<tbody>
		<tr>
			<td colspan="2">Select company types</td>
		</tr>
		<tr>
			<td>Raws</td>
			<td>Products</td>
		</tr>
		<tr>
			<td>
				<i style="position:absolute" class="icon-Iron"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Iron</button>
			</td>
			<td>
				<i style="position:absolute" class="icon-Weapon"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Weapon</button>
			</td>
		</tr>
		<tr>
			<td>
				<i style="position:absolute" class="icon-Grain"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Grain</button>
			</td>
			<td>
				<i style="position:absolute" class="icon-Food"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Food</button>
			</td>
		</tr>
		<tr>
			<td>
				<i style="position:absolute" class="icon-Diamonds"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Diamonds</button>
			</td>
			<td>
				<i style="position:absolute" class="icon-Gift"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Gift</button>
			</td>
		</tr>
		<tr>
			<td>
				<i style="position:absolute" class="icon-Oil"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Oil</button>
			</td>
			<td>
				<i style="position:absolute" class="icon-Ticket"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Ticket</button>
			</td>
		</tr>
		<tr>
			<td>
				<i style="position:absolute" class="icon-Wood"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Wood</button>
			</td>
			<td>
				<i style="position:absolute" class="icon-home"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Home</button>
			</td>
		</tr>
		<tr>
			<td>
				<i style="position:absolute" class="icon-Stone"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Stone</button>
			</td>
			<td>
				<i style="position:absolute" class="icon-estate"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Estate</button>
			</td>
		</tr>
		<tr>
			<td>
			</td>
			<td>
				<i style="position:absolute" class="icon-defense-system"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">defense-system</button>
			</td>
		</tr>
		<tr>
			<td>
			</td>
			<td>
				<i style="position:absolute" class="icon-hospital"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">Hospital</button>
			</td>
		</tr>
		<tr>
			<td>
			</td>
			<td>
				<i style="position:absolute" class="icon-uniF005"></i><button class="chn_typ" style="border: 0px;width: 100px;background: transparent;color: white;">uniF005</button>
			</td>
		</tr>
	</tbody>
</table>
</div></div>`);
                $( "#netice .rev").remove();
                $("#netice" ).click(function() {$("#netice" ).remove();$(".sec").removeClass("sec")})
                $( "#netice button").click(function(){
                    $(".sec").text($(this).text())
                    $(".sec").addClass("chn_typ icon-"+ $(this).text())
                    $(".sec").removeClass("sec")
                    $("#netice").remove()
                }
                                          )
            });
        }
        document.getElementById("save").onclick= function(){
            var stocks =  [];
            //  alert(JSON.stringify(stocks));
            if(document.getElementById('set1_yes').checked) {
                stocks.push(1);
            }else if(document.getElementById('set1_no').checked) {
                stocks.push(0);
            }
            if(document.getElementById('set2_yes').checked) {
                stocks.push(1);
            }else if(document.getElementById('set2_no').checked) {
                stocks.push(0);
            }
            if(document.getElementById('set3_yes').checked) {
                stocks.push(parseInt(document.getElementById("stock_id").value));
            }else if(document.getElementById('set3_no').checked) {
            }
            $.cookie('stocks',JSON.stringify(stocks),{ expires : 30 });
            // alert(JSON.parse($.cookie('stocks')));
            // alert(JSON.stringify(stocks));
            var table = document.getElementById("sal");
            var categories =  [];
            for (var s = 0, m = document.getElementsByClassName("cat_len").length; s < m; s++) {
                categories.push(document.getElementsByClassName("cat_len")[s].textContent);
            }
            $.cookie('categories',JSON.stringify(categories),{ expires : 30 });
            var companies =  [];
            if(table.rows.length== 1){$.cookie('companies',JSON.stringify(companies),{ expires : 30 });
                                     }else{
                                         for (var r = 1, n = table.rows.length; r < n; r++) {
                                             var Comp_cat = table.rows[r].cells[0].children[0].textContent;
                                             var Comp_id =  table.rows[r].cells[1].children[0].value;
                                             var Comp_type= table.rows[r].cells[2].children[0].textContent;
                                             var Comp_name= table.rows[r].cells[3].children[0].value;
                                             companies.push([Comp_cat,Comp_id,Comp_type,Comp_name]);
                                         }
                                         $.cookie('companies',JSON.stringify(companies),{ expires : 30 });
                                     }
            Return();
        };
    }


    function insertCmp(b,c,d,e) {
        var table = document.getElementById('sal');
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = b;
        cell2.innerHTML = c;
        cell3.innerHTML = e;
        cell4.innerHTML = d;
        cell5.innerHTML = `<button onclick="$(this).closest('tr').remove()" style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Remove</button>`;
    }
    function companies(){
        if($.cookie('categories')){
            var s_categories = JSON.parse($.cookie('categories'));
            var s_companies = JSON.parse($.cookie('companies'));
            for (var s = 0, m = s_categories.length; s < m; s++) {
                addcategory(s_categories[s],s_categories[s]);
            }
            for (var a = 0, n = s_companies.length; a < n; a++) {
                addcomp(s_companies[a][0],s_companies[a][2],s_companies[a][1],s_companies[a][3]);
            }
        }else{settings_main();}
    }
    function removecat(){
        if(!document.getElementById("camp")){
            var s_categories = JSON.parse($.cookie('categories'));
            if(s_categories.length){
                for (var s = 0, m = s_categories.length; s < m; s++) {
                    document.getElementById(s_categories[s]).remove();
                }
                addcategory('camp','<button id="return" class="buts s" style="background-color: rebeccapurple;color: white;border: 1px solid;border-right: none;border-radius: 5px 0px 0px 5px;float: right;width: 180px;">⟲ Update page</button>');
                document.getElementById("return").onclick = function() {
                    document.getElementById('camp').remove();
                    Return();
                };
            }
        }
    }
    function thanks(){
        close_left();
        unselect();
        document.getElementById("main").innerHTML = `
<center>
<img id="LOGOS" src="https://suna.e-sim.org:3000/avatars/539294_normal" style="margin-top:  10px;background-color: #8b00006e;border: 2px solid grey;border-radius: 50%;padding: 10px;">
<div style="font-size: 20px;color: white;font-style: oblique;margin-top: 5px !important;background: #000000a3;padding: 5px;border-radius:  9px;width: 250px;border: 1px solid;">Thank you for choosing us</div>
<div id="banner">
<button id="st1" style="display:none" class="box"><i class="icon-dagger" title="Stock in you acoount" style="font-size:40px;display:block"></i></button>
<button id="st2" style="display:none" class="box"><i class="icon-route" title="Stock in you military unit" style="font-size:40px;display:block"></i></button>
<button id="st3" style="display:none" class="box"><i class="icon-stocks" title="Stock in SC" style="font-size:40px;display:block"></i></button>
<button id="st4" style="display:block" class="box"><i class="icon-factory" title="Companies"  style="font-size:40px;display:block"></i></button>
<button id="st5" style="display:block" class="box"><i class="icon-image" title="Background and music" style="font-size:40px;display:block"></i></button>
<button id="st6" style="display:block" class="box"><i class="icon-uniF00F" title="Configuration" style="font-size:40px;display:block"></i></button>
</div>
</center>
`;
        document.getElementById("LOGOS").onclick = function() {md_alarm("info","WσʅF FʅσƈK")}
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        var dateTime = date+' '+time;
        if($.cookie('stocks')){
            var s_stoks = JSON.parse($.cookie('stocks'));
            if(s_stoks[0]==1){document.getElementById("st1").style.display="block";
                              document.getElementById("st1").onclick=function() {
                                  close_left();
                                  unselect();
                                  $("#banner").toggle( "fold", 1000 );
                                  $('body>.ui-tooltip').remove();
                                  setTimeout(show_stock,500);
                              }
                              ;}else{document.getElementById("st1").style.display="none";}
            if(s_stoks[1]==1){document.getElementById("st2").style.display="block";
                              document.getElementById("st2").onclick=function() {
                                  close_left();
                                  unselect();
                                  $.cookie('stock_m_id','have');
                                  $('body>.ui-tooltip').remove();
                                  message_js('Military Unit');
                                  $("#main_s").load("militaryUnitStorage.html .testDivwhite")
                                  $("#main_s1").load("militaryUnitMoneyAccount.html .testDivwhite")
                              };
                             }else{document.getElementById("st2").style.display="none";}
            if(s_stoks.length == 3){document.getElementById("st3").style.display="block";
                                    document.getElementById("st3").onclick=function() {
                                        $.cookie('stock_c_id',s_stoks[2]);
                                        close_left();
                                        unselect();
                                        $('body>.ui-tooltip').remove();
                                        message_js("Stock Company");
                                        $("#main_s1").load("stockCompanyMoney.html?id="+ s_stoks[2]+" .testDivblue:eq(1)")
                                        $("#main_s").load("stockCompanyProducts.html?id="+ s_stoks[2]+" .testDivwhite")
                                    };
                                   }else{document.getElementById("st3").style.display="none";}
        }
        document.getElementById("st4").onclick = function() {
            $("#drop").css("background-image","none");
            $("#banner").toggle( "fold", 1000 );
            $('body>.ui-tooltip').remove();
            document.getElementById("left_mini").style.display="none";
            document.getElementById("left").style.display="block";
            document.getElementById("drop").style.display="block";
            document.getElementById("main").style.width = "738px";
            $("#drop" ).html(`<p style="width: auto;height: 25px;">Drop here</p>`);
        };
        document.getElementById("st5").onclick = function() {
            $('body>.ui-tooltip').remove();close_left();settings();unselect();document.getElementById("background").className="s butlar";};
        document.getElementById("st6").onclick= function(){
            $('body>.ui-tooltip').remove();close_left();removecat();settings_main();unselect();document.getElementById("configuration").className="s butlar";document.getElementById("settings").className="settings-select";};
    }
    function deleterow(a){
        document.getElementById(a).remove();
        var searchValue = a; //lets say your value is 456
        $("table tr").each(function(){
            $(this).find('td').each(function(){
                var currentText = $(this).text();
                if(currentText == searchValue){
                    $(this).parents('tr').remove();
                }
            });
        });
    }
    function Return(){
        if(document.getElementById("camp")){document.getElementById("camp").remove();}
        companies();
        thanks();
    }
    function close_left(){
        document.getElementById("left_mini").style.display="block";
        document.getElementById("left").style.display="none";
        //     document.getElementById("main").style.width = "99.9%";
    }
    function show_stock(){
        document.getElementById("main").innerHTML = `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;    height: fit-content;">
<div id="storageConteiner">
<div></div>
</div></center>` ;
        var vStorageProducts = false;
        if (!vStorageProducts) {
            vStorageProducts = true;
            $.ajax({
                type : "GET",
                url : "storage/product",
                data : {'selectedType' : "storageProducts"},
                success : function(msg) {
                    $('#storageConteiner > div').replaceWith(msg);
                }
            });
            //         window.location = "/storage.html?storageType=PRODUCTS";
        }
    }
    function show_money(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() // + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        document.getElementById("main").innerHTML = `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;height:400px;">
<div id="storageConteiner">
<div></div>
</div>
</div>
</center>   `
        ;
        var vStorageMoney = false;
        if (!vStorageMoney) {
            vStorageMoney = true;
            $.ajax({
                type : "GET",
                url : "storage/money",
                data : {'selectedType' : "storageMoney"
                       },                success : function(msg) {
                           $('#storageConteiner > div').replaceWith(msg);
                       }
            });
            //         window.location = "/storage.html?storageType=MONEY";
        }
    }
    function acc_details(acc_id){
        message_js("Account informations")
        $.ajax({
            type : "GET",
            url : "/apiCitizenById.html?id=" + acc_id,
            success : function(msg) {
                var obj = JSON.parse(msg);
                document.getElementById("main_s1").innerHTML = `
<div style="width:600px;min-height: 280px;">
<table class="bbtable" style="color:white;width: 300px;float: left;">
<tr>
<td>Nick :</td>
<td style="font-size: 20px;">` + obj.login + `</td>
</tr>
<tr>
<td>Rank :</td>
<td>` + obj.rank + `</td>
</tr>
<tr>
<td>Level :</td>
<td>` + obj.level + `</td>
</tr>
<tr>
<td>Experience :</td>
<td>` + obj.xp + `</td>
</tr>
<tr>
<td colspan="2"><button style="background: transparent;width: 90%;" id='`+ obj.companyId + `' class='get_CMP'>Company (#` + obj.companyId + `)</button></td>
</tr>
<tr>
<td>Damage :</td>
<td>` + obj.totalDamage + `</td>
</tr>
<tr>
<td>Todays Damage :</td>
<td>` + obj.damageToday + `</td>
</tr>
<tr>
<td>Economic skill :</td>
<td>` + obj.economySkill + `</td>
</tr>
<tr>
<td>Strengh :</td>
<td>` + obj.strength + `</td>
</tr>
<tr>
<td>Citizenship :</td>
<td><div class="xflagsSmall xflagsSmall-` + obj.citizenship + `"></div> ` + obj.citizenship + `</td>
</tr>
<tr>
<td>Premium days :</td>
<td>` + obj.premiumDays + `</td>
</tr>
<tr>
<td  colspan="2">
<button title="Default salary is 0 gold.You may edit after in salary page" id="add_ww" style="width: 90%;height: 30px;background: transparent;border: 1px solid white;color: white;border-radius: 10px;font-family: cursive;">Add worker</button>
</td>
</tr>
</table>
<table id="dis_mu" class="bbtable" style="text-align: left;color:white;width:280px;margin-bottom:15px">
<tr>
<td style="background: green">Military Unit:</td>
<td id="acc_mu" style="font-size: 20px;background: green"></td>
</tr>
<tr>
<td>Type :</td>
<td id="mu_type"></td>
</tr>
<td>Limits :</td>
<td id="maxMembers"></td>
</tr>
</table>
<table class="bbtable" style="text-align: left;color:white;width:280px">
<tr>
<td colspan="2">Equipment stats</td>
</tr>
<tr>
<td><i class="help icon icon-info" title="Your damage is doubled when performing a critical hit."></i>  Critical Hit chance :</td>
<td style="width:70px"><i class="icon-danger"></i> ` + obj.eqCriticalHit + `%</td>
</tr>
<tr>
<td><i class="help icon icon-info" title="You deal 0 damage when missing a hit. You lose weapon and health during a miss, however you still gain experience points."></i> Miss chance:</td>
<td><i class="icon-scope2"></i> ` + obj.eqReduceMiss + `%</td>
</tr>
<tr>
<td><i class="help icon icon-info" title="You will lose no health for any hit when this event is triggered"></i> Chance to avoid DMG:</td>
<td><i class="icon-shield2"></i>` + obj.eqAvoidDamage + `%</td>
</tr>
<tr>
<td>Less weapons per berserk :</td>
<td><i class="icon-gunshot"></i> ` + obj.eqIncreaseStrength + `%</td>
</tr>
<tr>
<td>Find a weapon chance :</td>
<td><i class="icon-weapon"></i> ` + obj.eqFindAWeapon + `%</td>
</tr>
<tr>
<td>Free flight :</td>
<td><i class="icon-airplane2"></i> ` + obj.eqFreeFlight + `%</td>
</tr>
<tr>
<td>IncreaseEcoSkill :</td>
<td><i class="icon-stockup"></i> ` + obj.eqIncreaseEcoSkill + `%</td>
</tr>
</table>
</div> `;
                $(".get_CMP").click(function() {
                    get_company(this.id)
                });
                document.getElementById("add_ww").onclick = function() {
                    var emp_o
                    $.cookie.json = true;
                    if($.cookie('employers') === null || $.cookie('employers') === "")
                    {
                        //no cookie
                        emp_o = []
                    }
                    else
                    {
                        //have cookie
                        emp_o = $.cookie("employers");
                        for (var i = 0; i < emp_o.length; i++){
                            if (emp_o[i][0] == obj.login){
                                md_alarm("alert",obj.login +` already registered`)
                                location.reload()
                                return
                            }
                        }
                        var w_ec = obj.economySkill
                        var w_ec_int = parseInt(w_ec)
                        emp_o.push([obj.login, obj.id, obj.companyId , w_ec_int , 0 , 0 , 0 , 0 ]);
                        //     alert(JSON.stringify(emp_o));
                        $.cookie("employers", emp_o , { expires : 30 });
                        //    alert("done");
                        location.reload();}
                };
                if (obj.militaryUnitId === 0){$("#dis_mu" ).remove();;return}
                $.ajax({
                    type : "GET",
                    url : "/apiMilitaryUnitById.html?id=" + obj.militaryUnitId,
                    success : function(msga) {
                        var obja = JSON.parse(msga)
                        document.getElementById("acc_mu").innerHTML = `<i class="icon-bookmark"></i> <a href="#" style="color:white" class="MU_NAME" id="`+ obj.militaryUnitId + `">` + obja.name + `</a>`;
                        document.getElementById("mu_type").innerHTML = obja.militaryUnitType;
                        document.getElementById("maxMembers").innerHTML = obja.maxMembers;
                        $(".MU_NAME").click(function() {
                            show_mu_mem(obj.id);
                        });
                    }
                })
            }
        })
    }
    function languages(a){
        message_js("Daily Supply");
        $("#main_s").load("militaryUnitStorage.html .testDivwhite")
        document.getElementById("main_s1").innerHTML =`<hr>
<table class="darktable" style="font-size:18px">
	<tbody>
		<tr>
			<td><i class="icon-Food"></td>
			<td>Food :</td>
			<td><input id="quan_food" type="text" style="width:50px" value="0"></td>
		</tr>
		<tr>
			<td><i class="icon-Gift"></td>
			<td>Gift :</td>
			<td><input id="quan_gift" type="text" style="width:50px" value="0"></td>
		</tr>
		<tr>
			<td><i class="icon-Weapon"></td>
			<td>Q1 Weapon :</td>
			<td><input id="quan_wep" type="text" style="width:50px" value="0"></td>
		</tr>
		<tr>
			<td><i class="icon-Ticket"></td>
			<td>Ticket :</td>
			<td><input id="quan_ticket" type="text" style="width:50px" value="0"></td>
		</tr>
		<tr>
			<td colspan="3"><button id="daily_sent" style="width: -webkit-fill-available;background: #0e0eccba;color: wheat;border: 1px solid;border-radius: 11px 0;font-size: 22px;">Donate</button></td>
		</tr>
	</tbody>
</table>
`
  $("#daily_sent").click(function(){
      $.post( "militaryUnitStorage.html" , { product: "5-FOOD", quantity: $("#quan_food").val() , reason : "Daily supply : " + $("#quan_food").val() + "xF, " + $("#quan_gift").val() + "xG, "+ $("#quan_wep").val() + "xW, "+ $("#quan_ticket").val() + "xT", citizen1 : a }).done(function() {})
      $.post( "militaryUnitStorage.html" , { product: "5-GIFT", quantity: $("#quan_gift").val() , reason : "Daily supply : " + $("#quan_food").val() + "xF, " + $("#quan_gift").val() + "xG, "+ $("#quan_wep").val() + "xW, "+ $("#quan_ticket").val() + "xT", citizen1 : a }).done(function() {})
      $.post( "militaryUnitStorage.html" , { product: "1-WEAPON", quantity: $("#quan_wep").val() , reason : "Daily supply : " + $("#quan_food").val() + "xF, " + $("#quan_gift").val() + "xG, "+ $("#quan_wep").val() + "xW, "+ $("#quan_ticket").val() + "xT", citizen1 : a }).done(function() {})
      $.post( "militaryUnitStorage.html" , { product: "1-TICKET", quantity: $("#quan_ticket").val() , reason : "Daily supply : " + $("#quan_food").val() + "xF, " + $("#quan_gift").val() + "xG, "+ $("#quan_wep").val() + "xW, "+ $("#quan_ticket").val() + "xT", citizen1 : a }).done(function() {})
      document.getElementById("main_s").innerHTML = $("#quan_food").val() + "xF, " + $("#quan_gift").val() + "xG, "+ $("#quan_wep").val() + "xW, "+ $("#quan_ticket").val() + "xT donated"
  })
    }
    function show_mu_mem(ids){
        document.getElementById("main").innerHTML = `<center><div id="munas" style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;/* height:400px; */margin-bottom: 70px !important;">
</div>
</center>   ` ;
        $("#munas").draggable({ containment: "main" });
        $.ajax({
            type : "GET",
            url : "/apiCitizenById.html?id="+ids,
            success : function(msgs) {
                var obja = JSON.parse(msgs);
                $.ajax({
                    type : "GET",
                    url : "/apiMilitaryUnitMembers.html?id=" + obja.militaryUnitId,
                    success : function(msg) {
                        var i ,txt = msg
                        var obj = JSON.parse(txt);
                        var SD = `<table id="MU_MEM" class="bbTable" style="
color: white;"><tbody><tr><td id="sun" colspan="5" style="font-size:20px;height:50px;background: #008000bd;">MU NAME</td><td id="wun" colspan="1" style="text-align:left;background: #008000bd;">STATS</td></tr><tr></tr><tr><td style="
width: 30px;background-color: rebeccapurple;">#</td><td style="
width: 30px;background-color: rebeccapurple;"></td><td style="
width: 250px;background-color: rebeccapurple;">Nick</td><td style="
width: 150px;
background-color: rebeccapurple;">Rank</td><td style="
width: 150px;
background-color: rebeccapurple;">Company</td><td style="
width: 150px;
background-color: rebeccapurple;">Premium Message</td></tr>`;
                        var iks
                        for (i = 0; i < obj.length; i++) {
                            iks = i;
                            iks++;
                            SD += `<tr><td>`+ iks + `</td><td><div class="xflagsSmall xflagsSmall-` + obj[i].citizenship + `"></div></td><td><b>` + obj[i].login + `</b> (<a href='#' style='color:yellow' class='acc_info' data-id='` + obj[i].id + `'>#` + obj[i].id + `)</td><td>` + obj[i].rank + `</td><td><button id="`+ obj[i].companyId +`" style="background: transparent;color:white;border: 1px solid;border-radius: 5px;" align="absmiddle">Get Company</button></td><td><p id="`+ obj[i].id +`" data-id="`+ obj[i].login + `" style="font-size:18px;color: white;"><i class="icon-email2"></i></p></td></tr>`;
                        }
                        SD += `</tbody></table>`;
                        document.getElementById("munas").innerHTML= SD;
                        for (i = 0; i < obj.length; i++) {
                            document.getElementById(obj[i].id).onclick= function(){
                                prem_list();
                                document.getElementById('ct_name').value = $(this).data("id");
                                document.getElementById("sc_frie").click();
                            }
                            document.getElementById(obj[i].companyId).onclick= function(){
                                get_company(this.id)
                            }
                        }
                        $(".acc_info").click(function() {
                            acc_details($(this).data("id"))
                        });
                    }
                });
                $.ajax({
                    type : "GET",
                    url : "/apiMilitaryUnitById.html?id=" + obja.militaryUnitId,
                    success : function(msga) {
                        var obja = JSON.parse(msga)
                        document.getElementById("sun").innerHTML= `<i class="icon-bookmark"></i>` + obja.name ;
                        document.getElementById("wun").innerHTML= `Type : `+ obja.militaryUnitType + `</br>Limits : ` + obja.maxMembers;
                    }
                })
            }
        })
    }
    function getConversation() {
        $('#nickMessage').val($('#speaker_' + speakerId).children('a').data("login"));
        $('.activeConversation').removeClass('activeConversation');
        $(this).addClass('activeConversation');
        $('.ajaxLoading').show();
        $.ajax({
            type: "GET",
            url: "premiumMessagesAjax.html",
            data: {'id': speakerId },
            success: function (data) {
                $('.ajaxLoading').hide();
                $("#messageArea").html(data);
                $("#premiumMessagesPrefix").remove();
                collapsReplay();
            }
        });
    }
    function sendPreviewRequest() {
        if (!isFormCorrect()) {
            return;
        }
        var dataString = "storageType=PRODUCT"
        + "&action=PREVIEW_OFFER"
        + "&country=" + $("#countryInput").val()
        + "&q-resource=" + $("#resourceInput").val()
        + "&price=" + $("#priceInput").val()
        + "&citizenship=59";
        $.ajax({
            type : "POST",
            url : "storage.html",
            data : dataString,
            dataType : "html",
            success : function(msg) {
                $("#preview").html(msg);
            }
        });
    }
    function insertsap() {
        if($.cookie('employers'))
        {
            //  alert(1);
            var employers = JSON.parse($.cookie('employers'));
            for(var i = 0; i < employers.length; i++ ){
                var table = document.getElementById('sap');
                var row = table.insertRow(table.rows.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                cell1.innerHTML = "<b>" + employers[i][0] + "</b> (<a href='#' style='color:yellow' class='acc_info' id='" + employers[i][1] + "'>#" + employers[i][1] + ")" ;
                cell2.innerHTML = "<button id='"+ employers[i][2] +"' class='get_CMP'>Company (#" + employers[i][2] + ")</button>";
                cell3.innerHTML = employers[i][3];
                cell4.innerHTML = employers[i][4];
                cell5.innerHTML = employers[i][5];
                cell6.innerHTML = employers[i][6];
                cell7.innerHTML = employers[i][7];
                $(".get_CMP").click(function() {
                    get_company(this.id)
                });
                $(".acc_info").click(function() {
                    acc_details(this.id)
                });
            }
        }else{for(var r = 0; r < 1; r++ ){
            var tablea = document.getElementById('sap');
            var rowa = tablea.insertRow(1);
            var cella1 = rowa.insertCell(0);
            var cella2 = rowa.insertCell(1);
            var cella3 = rowa.insertCell(2);
            var cella4 = rowa.insertCell(3);
            var cella5 = row.insertCell(4);
            var cella6 = row.insertCell(5);
            var cella7 = row.insertCell(6);
            cella1.innerHTML = `No Worker`;
            cella2.innerHTML = `-`;
            cella3.innerHTML = `-`;
            cella4.innerHTML = `-`;
            cella5.innerHTML = `-`;
            cella6.innerHTML = `-`;
            cella7.innerHTML = `-`;
        }}
    }
    function onl(vals) {
        message_js("Online players");
        $("#main_s").load("citizensOnline.html?countryId=" + vals + " #countryId");
        $("#main_s1").load("citizensOnline.html?countryId=" + vals + " .testDivblue:eq(1)");
        document.getElementById("main_s2").innerHTML= `<button id="onl_pl" style="height: 40px;width: 100%;background: #e0567cba;color: white;border: none;font-size: 17px;font-style: oblique;">Show players</button>` ;
        document.getElementById("onl_pl").onclick= function(){onl($('#countryId').val())}
    }
    function salry() {
        message_js("Salary");
        document.getElementById("main_s").innerHTML =`
<table id="sap" class="bbTable" style="color:white;width: -webkit-fill-available;border-radius: 10px;"><tbody><tr><td style="width:90px">Workers</td><td style="width:90px">Company ID</td><td style="width:90px">Economical skill</td><td style="width:60px">Salary</td><td style="width:30px"><i class="icon-Food"></i></td><td style="width:30px"><i class="icon-Gift"></i></td><td style="width:30px"><i class="icon-Weapon"></i></td></tr></tbody></table>
`;
        document.getElementById("main_s1").innerHTML =`<button id="emp_add" style="margin-top: 10px;height: 30px !important;background: #0000ff78;color: white;border: 1px solid white;width: -webkit-fill-available;border-radius: 5px;">Edit workers</button>
<button id="sava_sal" style="margin-top:10px;height: 30px !important;background: #008000b8;color: white;border: 1px solid white;width: -webkit-fill-available;;border-radius: 5px;" disabled>Save</button>`
        insertsap();
        document.getElementById("emp_add").onclick= function(){
            //  $( ".delt" ).remove();
            $("#sava_sal").attr("disabled", false)

            document.getElementById("main_s").innerHTML =`
<table id="sap" class="bbTable" style="color:white;width: -webkit-fill-available;border-radius: 10px;"><tbody><tr><td>Workers</td><td>Player ID</td><td>Company ID</td><td>Eco skill</td><td>Salary</td><td style="width:30px"><i class="icon-Food"></i></td><td style="width:30px"><i class="icon-Gift"></i></td><td style="width:30px"><i class="icon-Weapon"></i></td><td></td></tr></tbody></table>
`;
            var employers = JSON.parse($.cookie('employers'));
            for(var i = 0; i < employers.length; i++ ){
                var table = document.getElementById('sap');
                var row = table.insertRow(table.rows.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                var cell8 = row.insertCell(7);
                var cell9 = row.insertCell(8);
                cell1.innerHTML = `<input style="font-size: 15px;background: TRANSPARENT;color: wheat;border: none;width:90px !important;text-align: center;" type="text" placeholder="Player Name" value="`+ employers[i][0] +`"disabled>`;
                cell2.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:60px !important;text-align: center;" type="text" placeholder="Player ID" value="`+ employers[i][1] +`"disabled>`;
                cell3.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:60px !important;text-align: center;" type="text" placeholder="Company ID" value="`+ get_inf_com(employers[i][1]) +`"disabled>`;
                cell4.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:60px !important;text-align: center;" type="text" placeholder="Economical skill" value="`+ get_inf_ecc(employers[i][1]) +`"disabled>`;
                cell5.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:60px !important;text-align: center;" type="number" min="0" max="300" placeholder="Salary" value="`+ employers[i][4] +`">`;
                cell6.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:40px !important;text-align: center;" type="number" min="0" max="300" placeholder="0" value="`+ employers[i][5] +`">`;
                cell7.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:40px !important;text-align: center;" type="number" min="0" max="300" placeholder="0" value="`+ employers[i][6] +`">`;
                cell8.innerHTML = `<input style="background: transparent;color: wheat;border: none;width:40px !important;text-align: center;" type="number" min="0" max="300" placeholder="0" value="`+ employers[i][7] +`">`;
                cell9.innerHTML = `<button onclick="$(this).closest('tr').remove()" style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Remove</button>`;
                callback();
            }



        }
        document.getElementById("sava_sal").onclick= function(){
            $("#sava_sal").attr("disabled", true)
            $("#emp_add").attr("disabled", false)
            var employers = []
            var worker ;
            var worker_id ;
            var workid;
            var ecos;
            var salary ;
            var com_food ;
            var com_gift ;
            var com_wep ;
            for(var i = 1; i < document.getElementById("sap").rows.length; i++ ){
                worker = document.getElementById("sap").rows[i].cells[0].children[0].value;
                worker_id = document.getElementById("sap").rows[i].cells[1].children[0].value;
                workid = document.getElementById("sap").rows[i].cells[2].children[0].value;
                ecos = document.getElementById("sap").rows[i].cells[3].children[0].value;
                salary = document.getElementById("sap").rows[i].cells[4].children[0].value;
                com_food = document.getElementById("sap").rows[i].cells[5].children[0].value;
                com_gift= document.getElementById("sap").rows[i].cells[6].children[0].value;
                com_wep = document.getElementById("sap").rows[i].cells[7].children[0].value;
                if(salary === ""){salary = 0}
                if(com_food === ""){com_food = 0}
                if(com_gift === ""){com_gift = 0}
                if(com_wep === ""){com_wep = 0}
                employers.push([worker,worker_id,workid,ecos,salary,com_food,com_gift,com_wep]);
            }
            //    alert(JSON.stringify(employers));
            $.cookie('employers',JSON.stringify(employers),{ expires : 30 });
            salry();
        }
    }
    function prem_list(){
        document.getElementById("main").innerHTML = `
<div id="sazd"></div><center><div style="min-width:483px;float:left;color:white;background-color:#02061f7d;width: -webkit-fill-available;">
<div style="font-size: 18px;font-style: oblique;">Chat with :  <input id="ct_name" type="text"/><button id="sc_frie" style="height: 20px !important;background: #000000a8;color: white;border: 1px solid white;border-radius: 5px;font-size: 13px;">search</button><button  style="height: 20px !important;background: #000000a8;color: white;border: 1px solid white;border-radius: 5px;font-size: 13px;" id="chc_fr">Contact</button></div><hr>
<div class="premiumMessagePage">
<div style="float:left;margin-left:120px;padding:4px 30px;background-color:rgba(255,255,255,0.6);border: 1px solid rgba(255,255,255,0.8);border-radius:7px;"><a href="/inboxMessages.html"> Inbox messages </a> | <a href="/sentMessages.html"> Sent messages </a> | <a href="/composeMessage.html"> New message</a></div>
<div id="speakertabs">
<div id='messagesContainer' class="foundation-style  column-margin-vertical column no-style">
<p class="ajaxLoading" style="display:none"><i class='icon-email2'></i></p>
<div id="accordion">
<h3>
<i class=" icon-emailforward" ></i>
Reply
</h3>
<div id="sendPrivMessage" style="display:none">
<form class="validatedForm" action="#" method="POST">

<b style="display:block">Receiver:</b>
<input minlength="3" id="nickMessage" maxLength="32" name="receiverName" required style="width: 170px;" />

<b style="display:block">Title:</b>
<input id="titleInput" minlength="1" maxLength="100" name="title" required style="width: 400px;" />

<br/>
<b>Message:</b><br/>
<textarea id="messageForm" maxlength="10000" name="body" style="width:95%; height: 250px;" ></textarea>
<p style="display:inline"> Characters remaining:<p style='display:inline;' class="charsRemaining">10000</p>
<p style="clear: both"></p>


<p style="cleat: both"></p>
<input type="submit" value="Send"> &nbsp; <input id="previewButton" type="button" value="Preview">

</form>
</div>
</div>
<div id="previewDiv"></div>



<div id="alertArea">

</div>

<div id="messageArea">

</div>
<div id='pmNavigation'>
<button class="foundation-style button" id="newerMessages">
<i  class="icon-uniF472"></i>
Newer
</button>
<input id="pmgotopage" min="0" step="1" class="gotopage" type="number" class="tiny" />
<button id="pmgotopagesubmit" class="foundation-style button tiny-button">
Go
</button>
<button class="foundation-style button" id="olderMessages">
Older
<i class="icon-uniF473"></i>
</button>
</div>
</div>
`;
        addGlobalStyle(`.premiumFriendList {width: fit-content;padding: 4px 0px;background-color: #02061ff0;border-bottom: 1px solid white;border-right: 1px solid white;position:absolute;z-index:1}`);
        addGlobalStyle(`#nextPageOfFriendsList {display:none}`);
        addGlobalStyle(`#previousPageOfFriendsList {display:none}`);
        addGlobalStyle(`.premiumMessagePage a{color: #0D294B;text-shadow: 0 0 2px rgb(150, 150, 150);}`);
              addGlobalStyle(`.premiumMessagePage > div:nth-child(1) {margin-left: 220px !important;}`);

        addGlobalStyle(`.gotopage{width: 30px;padding: 0.56em;}`);
        addGlobalStyle(`.premiumMessagePage #messagesContainer>div{padding: 0 10px;margin: 8px 0;`);
        addGlobalStyle(`.premiumMessagePage .myMessage{background-color: rgba(0, 0, 0, 0.080);}`);
        addGlobalStyle(`.premiumMessagePage .messageBox{border-bottom: 1px dashed #888;clear: both;overflow: auto;padding: 5px;}`);
        addGlobalStyle(`.premiumMessagePage .messageBox:nth-child(1){border-top: 1px dashed #888;}`);
        addGlobalStyle(`.premiumMessagePage #messageArea{margin-bottom: 8px;margin-top: 8px;}`);
        addGlobalStyle(`.premiumMessagePage .raportMessage{padding-left: 100px;}`);
        addGlobalStyle(`.premiumMessagePage #inboxTable{background-color: #2c2c9029;width: 100%;margin-left: auto;margin-right: auto;}`);
        addGlobalStyle(`.premiumMessagePage #inboxTable a {color:yellow}`);
        addGlobalStyle(`.premiumMessagePage #showNewMessage{text-align: left;}`);
        addGlobalStyle(`.premiumMessagePage #sendPrivMessage{background-color: rgba(196, 196, 196, 0.9);overflow: hidden;/*background: rgba(0, 0, 0, 0.080);*/}`);
        addGlobalStyle(`.premiumMessagePage .bbcodebuttons{display: inline-block !important;line-height: 3em;}`);
        addGlobalStyle(`.premiumMessagePage .ajaxLoading{/*background: url('../img/animation/ajaxLoading.gif') no-repeat;*/background: url('//cdn.e-sim.org//img/animation/ajaxLoading.gif') no-repeat;color: rgba(0, 0, 0, 0.45);font-size: 16px;height: 32px;padding: 6px 0px 0 3px;position: absolute;right: 10px;margin: 0;width: 32px;z-index: 1;}`);
        addGlobalStyle(`#pmgotopage {width:50px}`);
        addGlobalStyle(`#flNavigation {display: none;}`);
        addGlobalStyle(`#speakerList a {color:white;}`);
        addGlobalStyle(`#speakerList div {margin: 5px;}`);
        addGlobalStyle(`#speakerList li>div {font-size: 11px;font-family: 'Open Sans',Arial,sans-serif;list-style: none;padding: 5px;border-radius: 3px;display: flex;align-items: center;box-sizing: content-box!important;}`);
        addGlobalStyle(`#speakerList{list-style: none;padding-left: 0px;margin-top: 0px;margin-bottom: 0px;}`);
        $('#miniscroll-asideSpeakerList').css('z-index', '10');
        var page = 1;
        //  getConversation();
        $('#pmgotopage').val(page);
        var searchTextForFriend = "";
        function goToPage(speakerId, page) {
            $.ajax({
                type: "GET",
                url: "premiumMessagesAjax.html",
                data: {'id': speakerId, 'page': page},
                success: function (data) {
                    $('#pmgotopage').val(page);
                    $("#messageArea").html(data);
                    var prefix = $("#premiumMessagesPrefix");
                    if (prefix.text() !== "OK")
                        page = prefix.text().split(" ")[1];
                    prefix.remove();
                }
            });
        }
        $("#showNewMessage").on("click", function () {
            $(this).slideUp();
            $("#sendPrivMessage").slideDown();
        });
        $("#accordion").accordion({
            collapsible: true,
            active: false
        });
        $('#pmgotopagesubmit').on('click', function(){
            page = $('#pmgotopage').val();
            goToPage(speakerId, page);
        } );
        $("#olderMessages").click(function () {
            goToPage(speakerId, page++);
        });
        $("#newerMessages").click(function () {
            goToPage(speakerId, page--);
        });
        $(".validatedForm").submit(function () {
            if($("#titleInput").val().length < 1 ){
                $("#titleInput").val('No title');
            }
            $.ajax({
                type: "POST",
                url: "premiumMessagesAjax.html",
                data: {nick: $("#nickMessage").val(),
                       title: $("#titleInput").val(),
                       message: $("#messageForm").val()}, /* form.serialize*/
                success: function (data) {
                    getConversation();
                    $("#titleInput").val("");
                    $("#messageForm").val("");
                    $("#previewDiv").val("");
                    $("#alertArea").prepend(data);
                    reloadContactList();
                    collapsReplay();
                },
                error: function (data) {
                    $("#messageForm").append(data);
                }
            });
            return false;
        });
        var collapsReplay = function () {
            $("#accordion").accordion('activate', -1);
        };
        ;

        function reloadContactList(pageFriendListNumber) {
            $.ajax({
                type: "GET",
                url: "premiumMessagesUserList.html",
                data: {'id': 82822, 'page' : pageFriendListNumber || 1, 'searchText' : searchTextForFriend },
                success: function (data) {
                    $("#sazd" ).html(data);

                }
            });

        }
        $("#chc_fr").click(function(event) {
            speakerId= $(".speaker").attr("data-citizenid");
            getConversation();
        });
        $("#sc_frie").click(function(event) {
            event.preventDefault();
            searchTextForFriend = $('#ct_name').attr("value");
            if (/\w+/.test(searchTextForFriend) || searchTextForFriend=="") {
                reloadContactList();
            }
            speakerId= $(".speaker").attr("data-citizenid");
            getConversation();
        });

    }

    if($.cookie("stock_m_id")){
        $.removeCookie("stock_m_id");
        if(window.location.href.indexOf("militaryUnitStorage.html") > -1) {
            document.body.style.backgroundImage = `none` ;
            var priceEls1 = document.getElementsByClassName("testDivwhite");
            var price1 = priceEls1[0].innerHTML;
            document.body.innerHTML = price1;
            document.body.innerHTML = document.body.innerHTML.replace('Storage', '');
            addGlobalStyle(`body{margin:0px;padding:10px !important}`);
            addGlobalStyle(`.storage{background:none repeat scroll 0 0 #3d6571;border:1px solid #333;margin:0 2px 15px;box-shadow:0 0 1px rgba(0,180,255,0.2);-moz-box-shadow:0 0 1px rgba(0,180,255,0.2);-o-box-shadow:0 0 1px rgba(0,180,255,0.2);-webkit-box-shadow:0 0 1px rgba(0,180,255,0.2);border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;float:left}`);
            addGlobalStyle(`.storage>div:first-child{background:transparent;border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;color:white;font-weight:bold;height:15px;line-height:14px;text-align:center;text-shadow:1px 1px 2px black;width:52px}`);
            addGlobalStyle(`.storage>div:nth-child(2){background:url("../img/stripes.png") repeat scroll 0 0 #3d6571;border-top:1px solid #333;box-shadow:0 0 15px #555 inset;-webkit-box-shadow:0 0 15px #555 inset;-o-box-shadow:0 0 15px #555 inset;-moz-box-shadow:0 0 15px #555 inset;width:52px;height:52px}`);
            addGlobalStyle(`.storage>div:nth-child(2):hover{background-color:#2c90b2}`);
            addGlobalStyle(`.storage>div>img:last-child{position:relative;top:-9px;border-top:1px solid #333;background:#3d6571}.`);
            addGlobalStyle(`.storage>div>img:first-child{width:40px;height:40px;background:none!important;border:0;margin:6px;position:static;border-top:0}`);
            addGlobalStyle(`.storage{background:none repeat scroll 0 0 #3d6571;border:1px solid #333;margin:0 2px 15px;box-shadow:0 0 1px rgba(0,180,255,0.2);-moz-box-shadow:0 0 1px rgba(0,180,255,0.2);-o-box-shadow:0 0 1px rgba(0,180,255,0.2);-webkit-box-shadow:0 0 1px rgba(0,180,255,0.2);border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;float:left}`);
            addGlobalStyle(`.storage>div:first-child{background:transparent;border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;color:white;font-weight:bold;height:15px;line-height:14px;text-align:center;text-shadow:1px 1px 2px black;width:52px}`);
            addGlobalStyle(`.storage>div:nth-child(2){background:url("../img/stripes.png") repeat scroll 0 0 #3d6571;border-top:1px solid #333;box-shadow:0 0 15px #555 inset;-webkit-box-shadow:0 0 15px #555 inset;-o-box-shadow:0 0 15px #555 inset;-moz-box-shadow:0 0 15px #555 inset;width:52px;height:52px}`);
            addGlobalStyle(`.storage>div:nth-child(2):hover{background-color:#2c90b2}`);
            addGlobalStyle(`.storage>div>img:last-child{position:relative;top:-9px;border-top:1px solid #333;background:#3d6571}`);
            addGlobalStyle(`.storage>div>img:first-child{width:40px;height:40px;background:none!important;border:0;margin:6px;position:static;border-top:0}`);
        }
    }
    function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );
        if ( param ) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }


    function callback() {
        if ($.active !== 0) {
            $('*').css('cursor', 'wait');
            setTimeout(callback, '900');

            return;
        }
        //whatever you need to do here
        //...
    };

    function get_inf_com(acc_id){

        var info
        $.ajax({
            type : "GET",
            url : "/apiCitizenById.html?id=" + acc_id,
            async: false,

            success : function(msg) {
                var obj = JSON.parse(msg);
                info = obj.companyId
            }
        })
        return info
    }



    function get_inf_ecc(acc_id){




        var info
        $.ajax({
            type : "GET",
            url : "/apiCitizenById.html?id=" + acc_id,
            async: false,

            success : function(msg) {
                var obj = JSON.parse(msg);

                info = obj.economySkill
                info = parseInt(info)
            }
        })
        return info
    }
    function md_alarm(type,text){
        $( "#main" ).append(`<div style="position: absolute;top: 0;background: #050505b5;height: inherit;width: inherit;" id="netice"><div style="position: absolute;background: url(https://cdn.e-sim.org//img/lowPolyBg.jpg);top: 200px;left: 230px;color:white;border: 1px solid;border-radius: 10px;padding: 5px;width: 205px;" id="netem"></div>/<div>`)
        $("#netem" ).html(`<button id="slc_cls" class="icon-` + type + `" style="background: transparent;color: antiquewhite;border: none;width: inherit;"><hr>`+ text +`</button>`)
        $("#slc_cls" ).click(function() {$("#netice" ).remove()})
    }
    function get_company(id){
        message_js("Company (" + id + ")");
        $('#main_s').load("companyWorkResults.html?id="+ id + " #productivityTable");
        document.getElementById("main_s1").innerHTML =`
<table id="sapk" class="" style="margin-top: 20px;position: absolute;border-radius: 10px;background: rgba(0, 0, 0, 0.42);left: 30px;top: 218px;color: white;border: 1px solid;width: 500px !important;font-size: 16px;"><tbody><tr id="inf"><td style="width:120px">Workers</td><td style="visibility:hidden">Com ID</td><td>Eco skill</td><td>Salary</td><td><i class="icon-Food"></i></td><td><i class="icon-Gift"></i></td><td><i class="icon-Weapon"></i></td><td><input id="sapk_day" style="border: 1px dotted white;width: 60px;background: transparent;color: white;font-size: 14px;height: 20px;" type="text"></td></tr><tr id="trnz"><td colspan="8" style="text-align: center;border-bottom: 1px solid white;"><a id="don_trz"style="color: chocolate;"  href="#">Donation Tranzaction</a></td></tr></tbody></table>
<div id="main_s2" style="margin-top: 10px;margin-right: 10px;float: right;right: 15px;background: #000000a3;border: 1px solid;border-radius: 19px;"></div>`;
        $("#don_trz").click(function(){$("#sapk").css("background-color","black");$("#main_s2").load("transactionLog.html?type=DONATION&dayFrom=" + document.getElementById("sapk_day").value + "&dayTo=" + document.getElementById("sapk_day").value + " .paddedTable")})
        document.getElementById("sapk_day").value = document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
        $("#sapk").draggable({ containment: "#main" });
        var employers = JSON.parse($.cookie('employers'));
        for(var t = 0; t < employers.length; t++ ){
            var table = document.getElementById('sapk');
            var row = table.insertRow(table.rows.length);
            if( id == employers[t][2]){row.className = "cur_cas"}
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            //   var cell7 = row.insertCell(2);
            cell1.innerHTML = `<a href="#" style="color: white;">`+ employers[t][0] + `</a><span style="color:yellow" class="acc_info" data-id="`+ employers[t][1] +`">(#`+ employers[t][1] +`)</span>`;
            cell2.innerHTML = `<b style="visibility:hidden">` +employers[t][2] + `</b>` ;
            cell3.innerHTML = employers[t][3];
            cell4.innerHTML = `<p>` + employers[t][4] + `</p>`;
            cell5.innerHTML = `<p>` + employers[t][5] + `</p>`;
            cell6.innerHTML = `<p>` + employers[t][6] + `</p>`;
            cell7.innerHTML = `<p>` + employers[t][7] + `</p>`;
            cell8.innerHTML = `<button id="`+ employers[t][1] + `" class="icon-cash"></button><button id="`+ employers[t][1] + `" class="icon-cupcake"></button>`;
            var days = document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
            document.getElementById(employers[t][1]).onclick = function() {
                var sum = $(this).closest('tr').find('p:eq(0)').text()
                var sum_a = $(this).closest('tr').find('a').text()
                if(sum == 0){
                    md_alarm(`bug`,`Citizen don't work with Gold <div class="xflagsSmall xflagsSmall-Gold"></div>`)
                }
                else{
                    $( "#main" ).append(`<div style="position: absolute;top: 0;background: #050505b5;height: inherit;width: inherit;" id="netice"><div style="position: absolute;background: url(https://cdn.e-sim.org//img/lowPolyBg.jpg);top: 200px;left: 230px;color:white;border: 1px solid;border-radius: 10px;padding: 5px;width: 205px;" id="netem">
 <button id="slc_cls" style="position: absolute;top: 0;right: 0;border: 1px solid;border-radius: 0 9px 0 10px;background: darkgreen;color: wheat;">X</button><table class="bbtable" style="width: inherit;color:white">
    <tbody>
        <tr>
            <td colspan="2">Salary</td>
        </tr>
        <tr style="background: green;font-size: 14px;">
            <td>
                Worker
            </td>
            <td>`+ sum_a +` (<u id="worID" style="color:yellow">`+ this.id +`</u>)</td>
        </tr>
        <tr>
            <td>Salary day</td>
            <td>`+ document.getElementById("sapk_day").value +`</td>
        </tr>
        <tr>
            <td>Amount</td>
            <td style="font-size: 16px;">` + sum + ` Gold <div class="xflagsSmall xflagsSmall-Gold"></div></td>
        </tr>
    </tbody>
</table>
              <button id="mus" style="background-color: #008000b8;color: white;width: 49%;border-radius: 5px;height: 45px;float: left;border: 1px solid white;">Send from Military Unit</button>
              <button id="pms" style="background-color: blue;color: white;width: 49%;border-radius: 5px;height: 45px;float: right;border: 1px solid white;">Send from Personal</button></div>
</div>`);
                $("#slc_cls" ).click(function() {$("#netice" ).remove();})

                $("#pms").click(function(){
                    $.post( "donateMoney.html?id=" + $("#worID").text() , { currencyId: 0, sum : sum , reason : "Salary for " + document.getElementById("sapk_day").value })
                        .done(function(){$("#netem" ).html(`<button id="slc_cls" class="icon-checkmark" style="background: transparent;color: antiquewhite;border: none;width: initial;"><hr>Salary successfully paid</button>`)
                                         $("#slc_cls" ).click(function() {$("#netice" ).remove();})})
                })

                $("#mus").click(function(){
                    $.post( "militaryUnitMoneyAccount.html" , { currencyId: 0, sum : sum , reason : "Salary for " + document.getElementById("sapk_day").value , citizen1 : $("#worID").text() })
                        .done(function(){$("#netem" ).html(`<button id="slc_cls" class="icon-checkmark" style="background: transparent;color: antiquewhite;border: none;width: initial;"><hr>Salary successfully paid</button>`)
                                         $("#slc_cls" ).click(function() {$("#netice" ).remove();})})
                })
            };
        }
        $("#sapk tr").not(".cur_cas ,#inf , #trnz ").remove();
    }
        $(".icon-cupcake").click(function(){
            var ad = $(this).closest('tr').find('a').text()
            var g_food = $(this).closest('tr').find('p:eq(1)').text()
            var g_gift = $(this).closest('tr').find('p:eq(2)').text()
            var g_wep = $(this).closest('tr').find('p:eq(3)').text()
            if(g_food == 0 , g_gift == 0 , g_wep == 0){
                $( "#main" ).append(`<div style="position: absolute;top: 0;background: #050505b5;height: inherit;width: inherit;" id="netice"><div style="position: absolute;background: url(https://cdn.e-sim.org//img/lowPolyBg.jpg);top: 200px;left: 230px;color:white;border: 1px solid;border-radius: 10px;padding: 5px;width: 205px;" id="netem"></div>/<div>`)
                $("#netem" ).html(`<button id="slc_cls" class="icon-bug" style="background: transparent;color: antiquewhite;border: none;width: initial;"><hr>Citizen don't member military unit commune system</button>`)
                $("#slc_cls" ).click(function() {$("#netice" ).remove()})
            }else{
                $( "#main" ).append(`<div style="position: absolute;top: 0;background: #050505b5;height: inherit;width: inherit;" id="netice"><div style="position: absolute;background: url(https://cdn.e-sim.org//img/lowPolyBg.jpg);top: 200px;left: 230px;color:white;border: 1px solid;border-radius: 10px;padding: 5px;width: 205px;" id="netem">
                                <button id="slc_cls" style="position: absolute;top: 0;right: 0;border: 1px solid;border-radius: 0 9px 0 10px;background: darkgreen;color: wheat;">X</button><table class="bbtable" style="width: inherit;color:white">
                                <tbody>
                                        <tr>
                                            <td colspan="3">The items as salary</td>
                                        </tr>
                                        <tr style="background: green;font-size: 14px;">
                                            <td>
                                                Worker
                                            </td>
                                            <td colspan="2">`+ ad + ` (<u id="worID" style="color:yellow">`+ this.id +`</u>)</td>
                                        </tr>
                                        <tr>
                                            <td>Salary day</td>
                                            <td>`+ document.getElementById("sapk_day").value +`</td>
                                        </tr>
                                        <tr style="/* background: #000000b5; */">
                                            <td><i class="icon-Food"></i></td>
                                            <td><i class="icon-Gift"></i></td>
                                            <td><i class="icon-Weapon"></i></td>
                                        </tr>
                                        <tr>
                                            <td>`+ g_food +`</td>
                                            <td>`+ g_gift +`</td>
                                            <td>`+ g_wep +`</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3"><button id="send" style="background-color: blue;color: white;width: -webkit-fill-available;border-radius: 5px;border: 1px solid;height: 20px;">Send</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                </div>`);
            $("#slc_cls" ).click(function() {$("#netice" ).remove();})
            $("#send").click(function(){
                $.post( "militaryUnitStorage.html" , { product: "5-FOOD", quantity: g_food , reason : "Salary for " + document.getElementById("sapk_day").value , citizen1 : $("#worID").text() })
                $.post( "militaryUnitStorage.html" , { product: "5-GIFT", quantity: g_gift , reason : "Salary for " + document.getElementById("sapk_day").value , citizen1 : $("#worID").text() })
                $.post( "militaryUnitStorage.html" , { product: "1-WEAPON", quantity: g_wep , reason : "Salary for " + document.getElementById("sapk_day").value , citizen1 : $("#worID").text() })
                    .done(function(){$("#netem" ).html(`<button id="slc_cls" class="icon-checkmark" style="background: transparent;color: antiquewhite;border: none;width: initial;"><hr>Salary successfully paid</button>`)
                                     $("#slc_cls" ).click(function() {$("#netice" ).remove();})})
            })
        }})
        $(".acc_info").click(function() {
            acc_details($(this).data("id"))
            close_left();
            unselect();
        });
    }
})();
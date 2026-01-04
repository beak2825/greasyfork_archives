// ==UserScript==
// @name         Tool(2019)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       MR WOLF
// @include      *://*.e-sim.org/*
// @match        *://*.e-sim.org/*
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/392109/Tool%282019%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392109/Tool%282019%29.meta.js
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

    addGlobalStyle(`#proli a { margin-left:25px;font-size: 18px;font-style: oblique;color: white; }`);
    addGlobalStyle(`.changeback { width: 150px;height: 100px;border: 1px solid;border-radius: 0 10px 0 10px;background-size: cover !important;color: white;padding: 0px !important;margin: 4px !important;}`);
    addGlobalStyle(`.scrollbar{float: left;height: 300px;width: 65px;overflow-y: scroll;margin-bottom: 25px;}`);
    addGlobalStyle(`#main::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;}`);
    addGlobalStyle(`#main::-webkit-scrollbar{width: 8px;}`);
    addGlobalStyle(`#main::-webkit-scrollbar-thumb{border-radius: 10px;background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, rgb(122,153,217)),color-stop(0.72, rgb(73,125,189)),color-stop(0.86, rgb(28,58,148)));}`);
    addGlobalStyle(`#left::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;}`);
    addGlobalStyle(`#left::-webkit-scrollbar{width: 8px;}`);
    addGlobalStyle(`#left::-webkit-scrollbar-thumb{border-radius: 10px;background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, rgb(122,153,217)),color-stop(0.72, rgb(73,125,189)),color-stop(0.86, rgb(28,58,148)));}`);
    addGlobalStyle(`#left {display:none;float: left;width: 20%;height: 100%;overflow-y: auto;border-right: 1px solid white;background-color: #3341927d;}`);
    addGlobalStyle(`#left_mini {display:block;float: left;width: 4%;height: 100%;overflow-y: auto;border-right: 1px solid white;background-color: #3341927d;}`);
    addGlobalStyle(`#main {text-align:center;float: left;width: 95.9%;height: 100%;/* background-image: url('https://wallpapercave.com/wp/p9MpBZc.jpg'); */}`);
    addGlobalStyle(`#proli img {width:  30px;height:  30px;position:  absolute;top: 3px;left: 5px;}`);
    addGlobalStyle(`#proli {font-weight: normal;text-align: left;width: 100%;height: 40px;background-color: rgba(10, 34, 171, 0.6);border-right: none;border-left: none;border-image: initial;border-bottom: 1px solid wheat;border-top: 1px solid wheat;color: white;}`);
    addGlobalStyle(`.buts {font-weight: normal;text-align: left;width: 100%;height: 30px;background-color: transparent;border: none;color: #eaeaea;}`);
    addGlobalStyle(`.select-but {font-weight: bold; text-align: left; width: 100%; height: 30px; background-color: rgba(220, 201, 45, 0.7); border-right: none; border-left: none; border-image: initial; border-bottom: 1px solid wheat; border-top: 1px solid wheat;}`);
    addGlobalStyle(`#salary {    width: 50px;padding: 0px;height: 50px;color: aliceblue;background: white;position: fixed;top: 50px;left: 9px;border: 1px solid;border-radius: 12px;}}`);
    addGlobalStyle(`#id {width: 100%;height: 100%;background: rgba(0, 0, 0, 0.61);;position: fixed;top: 0;left:0;z-index: 9998;}`);
    addGlobalStyle(`#content {border: 1px solid yellowgreen;background-size: cover;top: 50%;left: 50%;width: 1000px;z-index: 9999;height: 700px;position: fixed;margin-top: -350px;margin-left: -500px;background-image: url(https://image.freepik.com/free-photo/_3236-46.jpg);}`);
    addGlobalStyle(`.mus-default {background: #334192a1;position:  absolute;top: 0px;right: 100px;font-size: 25px;width: 50px;text-align:  center;border: 1px solid white;border-right:  none;border-top:  none;color:  white;padding-left: 20px;border-radius: 0 0  0 100%;height: 40px;}`);
    addGlobalStyle(`.mus-select {background: #076960;position: absolute;top: 0px;right: 100px;font-size: 25px;width: 50px;text-align: center;border: 1px solid white;border-right: none;border-top: none;color: yellow;padding-left: 20px;border-radius: 0 0 0 100%;height: 40px;}`);
    addGlobalStyle(`.settings-default {background: #334192a1;position:  absolute;top: 0px;right: 50px;font-size: 18px;width: 50px;text-align:  center;border: 1px solid white;border-right:  none;border-top:  none;color:  white;border-radius: 0 0  0 0;height: 40px;}`);
    addGlobalStyle(`#close{background: #f44336b3;position:  absolute;top: 0px;right: 0px;font-size: 18px;width: 50px;text-align:  center;border: 1px solid white;border-right:  none;border-top:  none;color:  white;border-radius: 0 0  0 0;height: 40px;}`);
    addGlobalStyle(`.buts:hover{background: rgba(255, 255, 255, 0.24) !important;color:white;font-style: italic;font-weight: bold;}`);
    addGlobalStyle(`.butlar {color:white;border-left: 5px solid yellow !important;text-align: left;width: 100%;height: 30px;background-color: rgba(75, 35, 53, 0.9);border: none;}`);
    addGlobalStyle(`.settings-select {background: rgba(243, 220, 30, 0.7);position: absolute;top: 0px;right: 50px;font-size: 18px;width: 50px;text-align: center;border: 1px solid white;border-right: none;border-top: none;color: black;border-radius: 0 0 0 0;height: 40px;}`);
    addGlobalStyle(`#iq {width: 100%;height: 100%;background: rgba(0, 0, 0, 0.61);position: fixed;top: 0px;left: 0px;z-index: 9998;}`);
    addGlobalStyle(`#banner {height: 300px;width: 600px;margin-top: 20px;border: 1px solid white;color: white;background: #0000001f;border-radius: 20px;}`);
    addGlobalStyle(`.box {margin:5px;width: 190px;height: 140px;float: left;background-color: transparent;border: none;color: white}`);
    addGlobalStyle(`.box:hover {margin:5px;width: 190px;height: 140px;float: left;background:linear-gradient(to bottom, rgba(59, 18, 0, 0.6), rgb(92, 33, 8)) !important; ;border-radius: 20px}`);
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

    //    jQuery('<button/>', {id: 'salary',title: '<img class="articleImage" src="https://suna.e-sim.org:3000/avatars/539294_normal">',class : 'icon-scales',
    //    click: function() {
    //
    //    }
    //}).appendTo('#desktop-navbar');

    var bute = document.createElement("img");
    bute.id="salary"
    bute.setAttribute("src", "https://suna.e-sim.org:3000/avatars/539294_normal");
    document.getElementById('desktop-navbar').appendChild(bute);


    document.getElementById("salary").onclick = function () {



        if (!$('#content').length){
            this.disabled = true;
            jQuery('<div/>', {id: 'iq'}).appendTo('body');

            jQuery('<div/>', {id: 'content', html: `<div id="left" class="scrollbar">
<div id="proli">
</div>
<audio id="audio" preload="auto" src="` + $.cookie('mp3') + `" loop="true" autobuffer>
Unsupported in Firefox
</audio>
<div id="panel">
<button id="configuration" class="s buts"><i class="icon-uniF00F"></i> Configuration</button>
<button id="background" class="s buts"><i class="icon-image"></i> Background and Music</button>
</div>
<button id="back" class="s buts" style="margin-top:10px;margin-bottom:10px;background-color: rebeccapurple;color: white;border: 1px solid;border-right: none;border-radius: 5px 0px 0px 5px;float: right;width: 180px;"><i class="icon-home"></i>Return to Home page</button>
<div id="drop" style="display: block;width: 90%;height: 56px;border: 2px dashed white;margin: 8px;margin-top:  3px;float:  left;border-radius:  11px;text-align:  center;font-size:  16px;color:  white;"><p>Drop here</p></div>
</div>
<div id="left_mini">
<button id="donate_us" title="Donate us" class="tools-box" style="position:  absolute;bottom: 60px;left:  4px;"><i class="icon-value"></i></button>
<button id="home" title="Home page" class="tools-box" style="margin-top: 20px;"><i class="icon-home"></i></button>
<button id="money_a" title="You wallet" class="tools-box" style="margin-top: 20px;"><i class="icon-wallet"></i></button>
<button id="mu_a" title="Military unit members" class="tools-box" style="margin-top: 20px;"><i class="icon-fort"></i></button>
<button id="sal_list" title="Salary list" class="tools-box" style="margin-top: 20px;"><i class="icon-sc"></i></button>
<button id="msg_list" title="messages" class="tools-box" style="margin-top: 20px;"><i class="icon-email2"></i></button>
<button id="lang" title="Languages" class="tools-box" style="margin-top: 20px;"><i class="icon-earth"></i></button>
</div>
</div>
<div id="main" class="scrollbar">

</div>
<button id="aud" title="Music" class="mus-default">♫</button>
<button id="settings" title="Configuration" class="settings-default"><i class="icon-uniF00F"></i></button>
<button id="close" title="Close" onclick="document.getElementById('iq').style.display = 'none';document.getElementById('content').style.display = 'none' ;document.getElementById('salary').disabled=false">X</button>`}).appendTo('body');


            $("#content").draggable({ containment: "window" });

            document.getElementById("proli").innerHTML= document.getElementById("userAvatar").innerHTML;

            document.getElementById("home").onclick = function(){thanks();};
            document.getElementById("back").onclick = function(){thanks();};
            document.getElementById("money_a").onclick = function(){show_money();};
            document.getElementById("mu_a").onclick = function(){show_mu_mem();};
            document.getElementById("sal_list").onclick = function(){salry();};
            document.getElementById("msg_list").onclick = function(){prem_list();};
            document.getElementById("lang").onclick = function(){languages();};


            document.getElementById("donate_us").onclick = function(){
                if(window.location.href.indexOf("suna.e-sim.org") > -1) {
                    message_js("Donate us");
                    $("#main_s").load("donateMoney.html?id=487518  .testDivblue:eq(2)");
                    $.cookie('w_id','487518');$.cookie('d_work','have');
                }else if(window.location.href.indexOf("primera.e-sim.org") > -1) {
                    message_js("Donate us");
                    $("#main_s").load("donateMoney.html?id=696473  .testDivblue:eq(2)");
                    $.cookie('w_id','696473');$.cookie('d_work','have');
                }else {alert("You may donate us only main servers (no merge)");}
            };
            thanks();


            if (!!$.cookie('background')) {
                document.getElementById('content').style.backgroundImage = "url('" + $.cookie('background') + "')";
            }


            document.getElementById("configuration").onclick = function() {removecat();settings_main();unselect();document.getElementById("configuration").className="s butlar";document.getElementById("settings").className="settings-select";};
            document.getElementById("background").onclick = function() {close_left();settings();unselect();document.getElementById("background").className="s butlar";};



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
        d.innerHTML= `</i><span style="padding-left:5px">` + title + `</span>` ;
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
                        .html( but.innerText );
                    $(but).draggable({revert: "valid" , cancel: false,axis: "y"});
                    var ele = document.getElementsByClassName('s');
                    for (var i = 0; i < ele.length; i++ ) {
                        ele[i].className = "s buts";
                    }
                    but.className="s butlar";
                    message_js("Company")
                    $('#main_s').load("companyWorkResults.html?id="+ id + " #productivityTable");
                              document.getElementById("main_s1").innerHTML =`
<table id="sapk" class="bbTable" style="margin-top: 20px;position: absolute;width: 360px !important;;border-radius: 10px;background: silver"><tbody><tr><td>Workers</td><td>Salary</td><td><input id="sapk_day" style="border: 1px solid #333;width: 60px;" type="text"></td></tr></tbody></table>
<div id="main_s2" style="margin-top: 10px;margin-right: 10px;float: right;right: 15px;background: #000000a3;border: 1px solid;border-radius: 19px;"></div>`;
            document.getElementById("sapk_day").value = document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
                    $("#sapk").draggable({ containment: "#main" });
                    var employers = JSON.parse($.cookie('employers'));
                    for(var t = 0; t < employers.length; t++ ){
                        var table = document.getElementById('sapk');
                        var row = table.insertRow(table.rows.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        cell1.innerHTML = `<a href="profile.html?id=`+ employers[t][1] +`">`+ employers[t][0] +`</a>`;
                        cell2.innerHTML = `<p>` + employers[t][2] + `</p>`;
                        cell3.innerHTML = `<button id=`+ employers[t][1] + ` style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Donate</button>`;
                        var days = document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
                        document.getElementById(employers[t][1]).onclick = function() {
                            var sum = $(this).closest('tr').find('p').text()
                            $.post( "donateMoney.html?id=" + this.id , { currencyId: 0, sum : sum , reason : "Salary for " + document.getElementById("sapk_day").value }).done(function() {alert( "Salary send" );}).fail(function() {alert("error"); })
                        };

                    }

                }

            });

        };
        but.ondblclick = function() {
            var ele = document.getElementsByClassName('s');
            for (var i = 0; i < ele.length; i++ ) {
                ele[i].className = "s buts";
            }
            this.className="s butlar";
            message_js("Company")
            $('#main_s').load("companyWorkResults.html?id="+ id + " #productivityTable");
            document.getElementById("main_s1").innerHTML =`
<table id="sapk" class="bbTable" style="margin-top: 20px;position: absolute;width: 360px !important;;border-radius: 10px;background: silver"><tbody><tr><td>Workers</td><td>Salary</td><td><input id="sapk_day" style="border: 1px solid #333;width: 60px;" type="text"></td></tr></tbody></table>
<div id="main_s2" style="margin-top: 10px;margin-right: 10px;float: right;right: 15px;background: #000000a3;border: 1px solid;border-radius: 19px;"></div>`;
            document.getElementById("sapk_day").value = document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
            $("#sapk").draggable({ containment: "#main" });
            var employers = JSON.parse($.cookie('employers'));
            for(var t = 0; t < employers.length; t++ ){
                var table = document.getElementById('sapk');
                var row = table.insertRow(table.rows.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = `<a href="profile.html?id=`+ employers[t][1] +`">`+ employers[t][0] +`</a>`;
                cell2.innerHTML = employers[t][2];;
                cell3.innerHTML = `<button id=`+ employers[t][1] +` style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Donate</button>`;
                document.getElementById("contentDrop").getElementsByTagName('b')[1].innerHTML.match(/\d+/);
                document.getElementById(employers[t][1]).onclick = function() {
                    var sum = $(this).closest('tr').find('p').text()
                    $.post( "donateMoney.html?id=" + this.id , { currencyId: 0, sum : sum , reason : "Salary for " + document.getElementById("sapk_day").value }).done(function() {alert( "Salary send" );}).fail(function() {alert("error"); })
                };

            }
            document.getElementById(cat_id).appendChild(but);
            $(but).mouseleave(function() {
                //   $(but).draggable().css("position","relative");
            });

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
<div id="img_chn"></div><hr><i class="icon-uniF00F"></i> Change music <hr> Music :  <input id="def_mp3" style="border: 1px solid #333;width: 450px !important;" type="text" placeholder="music url"><button id="chn_mp3" style="height: 20px !important;background: #000000a8;color: white;border: 1px solid white;">change</button></div></center>   `;
        changeback("https://image.freepik.com/free-photo/_3236-46.jpg");
        changeback("https://png.pngtree.com/thumb_back/fw800/background/20190820/pngtree-fire-background-image_303159.jpg");
        changeback("https://media.istockphoto.com/photos/blaze-fire-flame-background-picture-id178420160?k=6&m=178420160&s=612x612&w=0&h=zROA1KUfOOwmwt9ZYo01y5z7g9xnOrgO6ui9l0_SdjU=");
        changeback("https://wallpaperaccess.com/full/128402.jpg");
        changeback("https://wallpapercave.com/wp/G4qMVSo.jpg");
        changeback("https://wallpapercave.com/wp/Hc4p0W1.jpg");
        changeback("https://wallpapercave.com/wp/LJcGVzC.jpg");
        changeback("https://wallpapercave.com/wp/p9MpBZc.jpg");




        document.getElementById("def_mp3").value = $.cookie('mp3');

        document.getElementById("chn_mp3").onclick = function() {
            $.cookie('mp3', document.getElementById("def_mp3").value,{ expires : 30 });

            alert(`Dafault music is changed(` + $.cookie('mp3') + `)`);
            document.getElementById('audio').src = $.cookie('mp3');

        };
    }

    function settings_main(){
        document.getElementById("main").innerHTML =
            `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 45px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;"><i class="icon-uniF00F"></i> Settings <hr>
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
<table id="sal" style="width: 100%;" class="bbTable table"><tbody><tr><td style="width: 25%;">Category</td><td style="width: 10%;">ID <i class="icon-info" style="font-size:  15px;" title="<b>Example:</b><br>*.e-sim.org/company.html?id=XXX<br>Write XXX to inputbox"></i></td><td style="width:10%">Type <i class="icon-info" style="font-size:  15px;" title="<b>Example:</b><ul style='list-style-type:disc'>
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
                        insertCmp(`<button style="background-color: rebeccapurple;color: white;border: 1px solid;margin: 1px;border-radius:  5px;">`+but.innerHTML+`</button>`,'<input style="border: 1px solid #333;" type="text">','<input style="border: 1px solid #333;width:99% !important" type="text">','<input style="border: 1px solid #333;" type="text">');};
                    document.getElementById('set_4_result').appendChild(but);
                    //      document.getElementById('set_4_result').innerHTML += `<button style="background: darkslategrey;color: white;border: 1px solid white;border-radius: 0 5px 5px 0;" onclick="$('#`+ but.id +`').remove();">x</button>`;
                    var but1 = document.createElement("button");
                    but1.style="background: darkslategrey;color: white;border: 1px solid white;border-radius: 0 5px 5px 0;margin-right: 5px;";
                    but1.innerHTML= 'x';
                    but1.title="Remove category : <b>" + document.getElementById("add_category_tex").value + "</b>";
                    but1.onclick = function() {
                        deleterow(but.id);
                        but1.remove();
                    };
                    document.getElementById('set_4_result').appendChild(but1);
                }else{alert('This category name already exist');}
            }else{alert('Category name cant be null.Please check again');}
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
                insertCmp(`<button style="background-color: rebeccapurple;color: white;border: 1px solid;margin: 1px;border-radius:  5px;">`+ s_companies[a][0]  +`</button>`,'<input style="border: 1px solid #333;" type="text" value="'+ s_companies[a][1] +'">','<input style="border: 1px solid #333;width:99% !important" type="text" value="'+ s_companies[a][3] +'">','<input style="border: 1px solid #333;" type="text" value="'+ s_companies[a][2] +'">');
            }
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
                                             var Comp_type= table.rows[r].cells[2].children[0].value;
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
        document.getElementById("panel").style.display="block";
        document.getElementById("main").innerHTML = `<div style="background: #0000009c;width: 230px;padding: 5px;border-bottom: 1px solid white;border-radius: 0px 15px 15px 0px;border-right: 1px solid white;
"><p id="overwiev" style="margin:0px;color:white;font-size:17px"></p></div>
<center>
<img src="https://suna.e-sim.org:3000/avatars/539294_normal" style="margin-top:  10px;background-color: #8b00006e;border: 2px solid grey;border-radius: 50%;padding: 10px;">
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
            $("#banner").toggle( "fold", 1000 );
            $('body>.ui-tooltip').remove();
            document.getElementById("panel").style.display="none";
            document.getElementById("left_mini").style.display="none";
            document.getElementById("left").style.display="block";
            document.getElementById("drop").style.display="block";
            document.getElementById("main").style.width = "79.9%";};
        document.getElementById("st5").onclick = function() {$('body>.ui-tooltip').remove();close_left();settings();unselect();document.getElementById("background").className="s butlar";};
        document.getElementById("st6").onclick= function(){$('body>.ui-tooltip').remove();close_left();removecat();settings_main();unselect();document.getElementById("configuration").className="s butlar";document.getElementById("settings").className="settings-select";};
        var url = $('#userName').prop('href');
        var ids = url.substring(url.lastIndexOf('=') + 1);

        $.ajax({
            type : "GET",
            url : "/apiCitizenById.html?id=" + ids,

            success : function(msg) {

                var obj = JSON.parse(msg);
                $('#overwiev').html(`Cənab `+ obj.rank + `</br>` + obj.login + ` xoş gəlmisiniz`);

            }
        })

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
        document.getElementById("main").style.width = "95.9%";
    }

    function show_stock(){
        document.getElementById("main").innerHTML = `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;    height: fit-content;">
<div id="storageConteiner">
<div></div>
</div>
</div>
</center>   `
        ;
        var vStorageProducts = false;


        if (!vStorageProducts) {
            vStorageProducts = true;


            $.ajax({
                type : "GET",
                url : "storage/product",
                data : {'selectedType' : "storageProducts"
                       },
                success : function(msg) {
                    $('#storageConteiner > div').replaceWith(msg);
                }
            });

            //         window.location = "/storage.html?storageType=PRODUCTS";
        }

        $("#quantity").focusout(function() {
            if ($("#quantity").val() % 1 != 0) {
                $("#quantitySpan").css("display","inline-block");
            } else {
                $("#quantitySpan").css("display","none");
                sendPreviewRequest();
            }
        });

        $("#resourceInput").focusout(function() {
            sendPreviewRequest();
            return;
        });
        $("#countryInput").focusout(function() {
            sendPreviewRequest();
            return;
        });
        $("#priceInput").focusout(function() {
            sendPreviewRequest();
            return;fst
        });

    }

    function show_money(){

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
                       },
                success : function(msg) {
                    $('#storageConteiner > div').replaceWith(msg);
                }
            });

            //         window.location = "/storage.html?storageType=MONEY";
        }



    }

    function languages(){


        message_js("Languages");
        document.getElementById("main_s").innerHTML =`
<div id="flag_az" class="xflagsMedium xflagsMedium-Azerbaijan"></div>
<div id="flag_tr" class="xflagsMedium xflagsMedium-Turkey"></div>
<div id="flag_uk" class="xflagsMedium xflagsMedium-United-Kingdom"></div>
<div id="flag_ru" class="xflagsMedium xflagsMedium-Russia"></div>`
        document.getElementById("flag_az").onclick = function () {$.post( "editCitizen.html" , { setLanguage: "Azerbaijani", action : "CHANGE_LANGAUGE" });location.reload();};
        document.getElementById("flag_tr").onclick = function () {$.post( "editCitizen.html" , { setLanguage: "Turkish", action : "CHANGE_LANGAUGE" });location.reload();};
        document.getElementById("flag_uk").onclick = function () {$.post( "editCitizen.html" , { setLanguage: "English", action : "CHANGE_LANGAUGE" });location.reload();};
        document.getElementById("flag_ru").onclick = function () {$.post( "editCitizen.html" , { setLanguage: "Russian", action : "CHANGE_LANGAUGE" });location.reload();};
    }

    function show_mu_mem(){
        var sexf
        var url = $('#userName').prop('href');
        var ids = url.substring(url.lastIndexOf('=') + 1);


        document.getElementById("main").innerHTML = `<center><div style="font-size: 20px;color: white;font-style: oblique;margin-top: 70px !important;background: #000000a3;padding: 5px;border-radius:  9px;border: 1px solid;width: 80%;/* height:400px; */margin-bottom: 70px !important;">
<div id="storageConteiner">
<div></div>
</div>
</div>
</center>   `
        ;
        $.ajax({
            type : "GET",
            url : "/apiCitizenById.html?id="+ids,

            success : function(msgs) {
                var obja = JSON.parse(msgs);
                sexf= obja.militaryUnitId;
                $.ajax({
                    type : "GET",
                    url : "/apiMilitaryUnitMembers.html?id=" + sexf,

                    success : function(msg) {
                        var i ,txt = msg
                        var obj = JSON.parse(txt);
                        var SD = `<table id="MU_MEM" class="bbTable" style="
color: white;"><tbody><tr><td style="
width: 30px;">#</td><td style="
width: 30px;"></td><td style="
width: 250px;">Nick</td><td style="
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
                            SD += `<tr><td>`+ iks + `</td><td><div class="xflagsSmall xflagsSmall-` + obj[i].citizenship + `"></div></td><td>`+ obj[i].login + "</td><td>" + obj[i].rank + `</td><td><button id="`+ obj[i].companyId +`" style="background: #ffffff;border: 1px solid;border-radius: 5px;" align="absmiddle">Get Company</button></td><td><button id="`+ obj[i].id +`" style="background: #ffffff;border: 1px solid;border-radius: 5px;" align="absmiddle">`+ obj[i].login +`</button></td></tr>`;
                        }
                        SD += `</tbody></table>`;
                        document.getElementById("storageConteiner").innerHTML= SD;
                        for (i = 0; i < obj.length; i++) {
                            document.getElementById(obj[i].id).onclick= function(){
                                prem_list();
                                document.getElementById('ct_name').value = $(this).text();
                                document.getElementById("sc_frie").click();
                            }
                            document.getElementById(obj[i].companyId).onclick= function(){
                                message_js('Company');
                                $('#main_s').load("companyWorkResults.html?id="+ this.id + " #productivityTable");
                                // document.getElementById("main").innerHTML =`<iframe width="100%" height="695px" src="companyWorkResults.html?id=` + this.id + `" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>`;

                            }




                        }



                    }
                });
            }
        })


        var vStorageMoney = false;

        if (!vStorageMoney) {
            vStorageMoney = true;



            //         window.location = "/storage.html?storageType=MONEY";
        }



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

    function isFormCorrect() {
        if ($("#resourceInput").val() == "") {
            return false;
        }
        if ($("#resourcePrice").val() == "") {
            return false;
        }
        return true;
    }

    function insertsap() {
        if($.cookie('employers'))
        {
            var employers = JSON.parse($.cookie('employers'));
            for(var i = 0; i < employers.length; i++ ){
                var table = document.getElementById('sap');
                var row = table.insertRow(table.rows.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = employers[i][0];
                cell2.innerHTML = `<a href="profile.html?id=`+ employers[i][1] +`">LINK</a>`;
                cell3.innerHTML = employers[i][2];;
                cell4.innerHTML = `<button id=`+ employers[i][1] +` style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Donate</button>`;
            }
        }else{for(var r = 0; r < 1; r++ ){
            var tablea = document.getElementById('sap');
            var rowa = tablea.insertRow(1);
            var cella1 = rowa.insertCell(0);
            var cella2 = rowa.insertCell(1);
            var cella3 = rowa.insertCell(2);
            var cella4 = rowa.insertCell(3);
            cella1.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Player Name">`;
            cella2.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Player ID">`;
            cella3.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Salary">`;
            cella4.innerHTML = `<button onclick="$(this).closest('tr').remove()" style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Remove</button>`;

        }}
    }

    function salry() {

        message_js("Salary");
        document.getElementById("main_s").innerHTML =`
<table id="sap" class="bbTable" style="width: -webkit-fill-available;border-radius: 10px;background: silver"><tbody><tr><td>Workers</td><td>ID</td><td>Salary</td><td></td></tr></tbody></table>
`;
        document.getElementById("main_s1").innerHTML =`<button id="emp_add" style="margin-top: 10px;height: 30px !important;background: #0000ff78;color: white;border: 1px solid white;width: -webkit-fill-available;border-radius: 5px;">Add saved workers</button>
<button id="emp_ref" style="margin-top: 10px;height: 30px !important;background: #ff00008f;color: white;border: 1px solid white;width: -webkit-fill-available;border-radius: 5px;">Add workers</button>
<button id="emp_del" style="margin-top: 10px;height: 30px !important;background: #9a6464a8;color: white;border: 1px solid white;width: -webkit-fill-available;border-radius: 5px;">Delete Workers</button>
<button id="sava_sal" style="margin-top:10px;height: 30px !important;background: black;color: white;border: 1px solid white;width: -webkit-fill-available;;border-radius: 5px;">Save</button>`
        insertsap();

        document.getElementById("emp_del").onclick= function(){
            $.removeCookie('employers', { path: '/' });
            salry();
        }

        document.getElementById("emp_ref").onclick= function(){

            var tabler = document.getElementById('sap');
            var rowr = tabler.insertRow(tabler.rows.length);
            var cell1r = rowr.insertCell(0);
            var cell2r = rowr.insertCell(1);
            var cell3r = rowr.insertCell(2);
            var cell4r = rowr.insertCell(3);
            cell1r.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Player Name" >`;
            cell2r.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Player ID" >`;
            cell3r.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Salary" >`;
            cell4r.innerHTML = `<button onclick="$(this).closest('tr').remove()" style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Remove</button>`;


        }



        document.getElementById("emp_add").onclick= function(){
            //  $( ".delt" ).remove();
            document.getElementById("main_s").innerHTML =`
<table id="sap" class="bbTable" style="width: -webkit-fill-available;border-radius: 10px;background: silver"><tbody><tr><td>Workers</td><td>ID</td><td>Salary</td><td></td></tr></tbody></table>
`;
            var employers = JSON.parse($.cookie('employers'));
            for(var i = 0; i < employers.length; i++ ){
                var table = document.getElementById('sap');
                var row = table.insertRow(table.rows.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);

                cell1.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Player Name" value="`+ employers[i][0] +`">`;
                cell2.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Player ID" value="`+ employers[i][1] +`">`;
                cell3.innerHTML = `<input style="border: 1px solid #333;width:160px !important" type="text" placeholder="Salary" value="`+ employers[i][2] +`">`;
                cell4.innerHTML = `<button onclick="$(this).closest('tr').remove()" style="height: 20px !important;background: darkred;color: white;border-radius: 0 5px;border: 1px solid white;">Remove</button>`;

            }

        }
        document.getElementById("sava_sal").onclick= function(){

            var employers = []
            var worker ;
            var worker_id ;
            var salary ;

            for(var i = 1; i < document.getElementById("sap").rows.length; i++ ){
                worker = document.getElementById("sap").rows[i].cells[0].children[0].value;
                worker_id = document.getElementById("sap").rows[i].cells[1].children[0].value;
                salary = document.getElementById("sap").rows[i].cells[2].children[0].value;
                employers.push([worker,worker_id,salary]);
            }

            alert(JSON.stringify(employers));
            $.cookie('employers',JSON.stringify(employers),{ expires : 30 });
            salry();
        }

    }

    function listem(){
        document.getElementById("main").innerHTML =  `<center>
<div  style="width: fit-content;height: fit-content;text-align:center;margin-top:  100px;padding:  10px;border-radius: 18px;background: #000000a3 !important;border: 1px solid white;">
<span style="font-size: 20px;text-shadow: 0 0 1px #652424, 0 0 2px #652424, 0 0 2px #652424;color: white;font-weight:  bold;">Salary list</span><hr><table id="sap" class="bbTable" style="border-radius: 10px;background: silver"><tbody><tr><td>eco</td><td>salary</td><td>eco</td><td>salary</td><td>eco</td><td>salary</td><td>eco</td><td>salary</td></tbody></table>
<button id="sava_sal" style="margin-top:10px;height: 30px !important;background: #9a6464a8;color: white;border: 1px solid white;width: 415px;border-radius: 5px;">Save</button>
</div>
</center>`;
        insertsap();
        var eco ;
        var salary ;

        document.getElementById("sava_sal").onclick= function(){
            var salari =  [];
            for(var i = 1; i < document.getElementById("sap").rows.length; i++ ){
                eco = document.getElementById("sap").rows[i].cells[0].innerHTML;
                salary =  document.getElementById("sap").rows[i].cells[1].children[0].value;
                salari.push([eco,salary]);
            }
            for(var ir = 1; ir < document.getElementById("sap").rows.length; ir++ ){
                eco = document.getElementById("sap").rows[ir].cells[2].innerHTML;
                salary =  document.getElementById("sap").rows[ir].cells[3].children[0].value;
                salari.push([eco,salary]);
            }
            for(var it = 1; it < document.getElementById("sap").rows.length; it++ ){
                eco = document.getElementById("sap").rows[it].cells[4].innerHTML;
                salary =  document.getElementById("sap").rows[it].cells[5].children[0].value;
                salari.push([eco,salary]);
            }
            for(var iy = 1; iy < document.getElementById("sap").rows.length; iy++ ){
                eco = document.getElementById("sap").rows[iy].cells[6].innerHTML;
                salary =  document.getElementById("sap").rows[iy].cells[7].children[0].value;
                salari.push([eco,salary]);
            }
            $.cookie('salari',JSON.stringify(salari),{ expires : 30 });
            thanks();
        };
    }

    function prem_list(){
        document.getElementById("main").innerHTML = `
<center><div id="sazd"></div><div style="max-width:483px;min-width:483px;margin-top: 20px;float:left;margin-left: 200px;padding:4px 30px;background-color:rgba(255,255,255,0.6);border: 1px solid rgba(255,255,255,0.8);border-radius:7px;">
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


        addGlobalStyle(`.premiumFriendList {
margin-top: 20px;
width: fit-content;;
padding: 4px 30px;
background-color: rgba(255,255,255,0.6);
border: 1px solid rgba(255,255,255,0.8);
border-radius: 7px;}`);
        addGlobalStyle(`#nextPageOfFriendsList {display:none}`);
        addGlobalStyle(`#previousPageOfFriendsList {display:none}`);




        addGlobalStyle(`.premiumMessagePage a{
color: #0D294B;
text-shadow: 0 0 2px rgb(150, 150, 150);
}`);
        addGlobalStyle(`.gotopage{
width: 30px;
padding: 0.56em;
}`);
        addGlobalStyle(`.premiumMessagePage #messagesContainer>div{
padding: 0 10px;
margin: 8px 0;
}`);
        addGlobalStyle(`.premiumMessagePage .myMessage{
background-color: rgba(0, 0, 0, 0.080);
}`);
        addGlobalStyle(`.premiumMessagePage .messageBox{
border-bottom: 1px dashed #888;
clear: both;
overflow: auto;
padding: 5px;
}`);
        addGlobalStyle(`.premiumMessagePage .messageBox:nth-child(1){
border-top: 1px dashed #888;
}`);
        addGlobalStyle(`.premiumMessagePage #messageArea{
margin-bottom: 8px;
margin-top: 8px;
}`);
        addGlobalStyle(`.premiumMessagePage .raportMessage{
padding-left: 100px;
}`);
        addGlobalStyle(`.premiumMessagePage #inboxTable{
background-color: rgba(196, 196, 196, 0.9);
width: 100%;
margin-left: auto;
margin-right: auto;
}`);

        addGlobalStyle(`.premiumMessagePage #showNewMessage{
text-align: left;

}`);
        addGlobalStyle(`.premiumMessagePage #sendPrivMessage{
background-color: rgba(196, 196, 196, 0.9);
overflow: hidden;
/*background: rgba(0, 0, 0, 0.080);*/
}`);
        addGlobalStyle(`.premiumMessagePage .bbcodebuttons{
display: inline-block !important;
line-height: 3em;
}`);
        addGlobalStyle(`.premiumMessagePage .ajaxLoading{
/*background: url('../img/animation/ajaxLoading.gif') no-repeat;*/
background: url('//cdn.e-sim.org//img/animation/ajaxLoading.gif') no-repeat;
color: rgba(0, 0, 0, 0.45);
font-size: 16px;
height: 32px;
padding: 6px 0px 0 3px;
position: absolute;
right: 10px;
margin: 0;
width: 32px;
z-index: 1;

}
`);



        addGlobalStyle(`#pmgotopage {width:50px}`);





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



})();
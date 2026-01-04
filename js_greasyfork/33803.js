// ==UserScript==
// @name    Alpha Xthor shoutbox
// @match   http*://xthor.to/shout*.php
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at document-end
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @version 0.2.0.4
// @description Ce script permet de cacher les messages système.
// @namespace https://greasyfork.org/users/74987
// @downloadURL https://update.greasyfork.org/scripts/33803/Alpha%20Xthor%20shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/33803/Alpha%20Xthor%20shoutbox.meta.js
// ==/UserScript==


// Info:
// Je suis pas dev web, donc le code peut faire mal eux yeux ^^

css_str = `
#control_panel_casino {
  position:fixed;
    top:230px;
    left:-180px;
    z-index: 999;
    padding: 0px;
    width:178px;
    background-color:#1f1f1f;
  -webkit-border-radius: 0 5px 5px 0;
  -moz-border-radius: 0 5px 5px 0;
  border-radius: 0 5px 5px 0;
}

#control_panel_custom {
  position:fixed;
    top:170px;
    left:-180px;
    z-index: 999;
    padding: 0px;
    width:178px;
    background-color:#1f1f1f;
  -webkit-border-radius: 0 5px 5px 0;
  -moz-border-radius: 0 5px 5px 0;
  border-radius: 0 5px 5px 0;
}


#control_label_casino {
    position:absolute;
    right:-29px;
    top:20px;
    width:29px;
    height:31px;
    background:url("https://lut.im/ZeEYQmR3t2/SbqBpKYA8pA7Y4EZ.png") no-repeat center center #1f1f1f;
    border-radius:0 5px 5px 0;
    -moz-border-radius:0 5px 5px 0;
    -webkit-border-radius:0 5px 5px 0;
  -webkit-transition: all .25s linear;
  -moz-transition: all .25s linear;
  -o-transition: all .25s linear;
  transition: all .25s linear;
}

#control_label_custom {
    position:absolute;
    right:-29px;
    top:20px;
    width:29px;
    height:31px;
    background:url("https://img.xthor.to/2017/06/54feef_shout2.png") no-repeat center center #1f1f1f;
    border-radius:0 5px 5px 0;
    -moz-border-radius:0 5px 5px 0;
    -webkit-border-radius:0 5px 5px 0;
  -webkit-transition: all .25s linear;
  -moz-transition: all .25s linear;
  -o-transition: all .25s linear;
  transition: all .25s linear;
}




:matches(#control_panel_custom #control_panel_casino) > div > span {
    display: block;
  margin-left: 2px;
  color: #fff;
  font-size: 0.817em;
  text-transform: uppercase;
  font-family: Arial;
}

:matches(#control_panel_custom #control_panel_casino) > form > div > label {
    display: block;
  margin-left: 2px;
  color: #fff;
  font-size: 0.817em;
  text-transform: uppercase;
  font-family: Arial;
}

:matches(#control_panel_custom #control_panel_casino) ul {
    overflow: hidden;
  padding:0;
  padding-bottom: 5px;
  list-style-type: none;
}

:matches(#control_panel_custom #control_panel_casino) li {
    float:left;
    margin:1px;
}

:matches(#control_panel_custom #control_panel_casino) li.active {
    border-color:#000;
}

:matches(#control_panel_custom #control_panel_casino) li a {
    width:31px;
    height:31px;
    border-radius:2px;
    -moz-border-radius:2px;
    -webkit-border-radius:2px;
    display:block;
}

:matches(#control_panel_custom #control_panel_casino) .apply_button_wrapper {
  clear: both;
  text-align:center;
    padding:10px 0 10px 0;
}


#control_label_custom:hover, #control_label_casino:hover {
  -webkit-box-shadow: inset 0 0 10px #686868;
  -moz-box-shadow: inset 0 0 10px #686868;
  box-shadow: inset 0 0 10px #686868;
}

:matches(#control_panel_custom #control_panel_casino) #backgrounds a {
  background-image: url("../images/patterns_sprite.png");
  background-repeat: no-repeat;
  border: 1px solid #000;
  width: 29px;
  height: 29px;
}
.remove_member {}
.barre {text-decoration:line-through;}

`;




GM_addStyle(css_str);

var hide=false;

var HideConf={};
HideConf["dupe"] = false;
HideConf["member"] = false;
HideConf["system"] = false;

HideConf["system_casino"] = false;
HideConf["system_gang"] = false;
HideConf["system_bookmaker"] = false;
HideConf["system_tombola"] = false;
HideConf["system_chifoumi"] = false;
HideConf["system_forum"] = false;
HideConf["system_upload"] = false;
HideConf["system_comment"] = false;
HideConf["system_market"] = false;
HideConf["system_potcommun"] = false;


//var IgnoreList = ['Earl', 'Kara'];
var IgnoreList = [];

var addMemberList=[];
var removeMemberList=[];

for (var i = 0; i < IgnoreList.length; i++) {
    IgnoreList[i]=IgnoreList[i].toLowerCase();
}

if (window.top === window.self) {
    var IconBigEmoti = $('#shout-commands');
    var control_panel = $('#control_panel');
    if (IconBigEmoti)
    {
        $(` <div id="control_panel_casino" class="" style="left: -180px;">
               <a href="#" id="control_label_casino" >
               </a>
            <div class="style_block">
                <form class="form-vertical">
                </form>
                <form name="p2p" method="post" action="casino.php">\
                        <div align="center">\
                        Proposer un pari<br>\
            <div style="display:inline-block">\
                        <input type="text" id="amnt" name="amnt" size="5" value="10">\
                        <select id="unit" name="unit" style="width:50px">\
                        <option value="1">Mio</option>\
                        <option value="0">Gio</option>\
                        <option value="2">Tio</option>\
                        </select></div>\
                        <a id="apply_button_casino" class="button casi">\
                            Parier!\
                        </a>\
            </div></form>
               </div>
            </div>
        `).insertBefore(control_panel);


        $(` <div id="control_panel_custom" class="" style="left: -180px;">
               <a href="#" id="control_label_custom" >
               </a>
            <div class="style_block">
                <form class="form-vertical">
                    <div class="checkbox">
                      <label>
                        <input id="dupe" class="detect_change" type="checkbox" value="">
                        Dupe
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        <input id="system" class="detect_change" type="checkbox" value="">
                        System
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_casino" class="detect_change" type="checkbox" value="">
                         Casino
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_gang" class="detect_change" type="checkbox" value="">
                         Gang
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_bookmaker" class="detect_change" type="checkbox" value="">
                         Bookmaker
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_tombola" class="detect_change" type="checkbox" value="">
                         Tombola
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_chifoumi" class="detect_change" type="checkbox" value="">
                         Chifoumi
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_forum" class="detect_change" type="checkbox" value="">
                         Forum
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_upload" class="detect_change" type="checkbox" value="">
                         Upload
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_comment" class="detect_change" type="checkbox" value="">
                         Commentaire
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_market" class="detect_change" type="checkbox" value="">
                         Market
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="system_potcommun" class="detect_change" type="checkbox" value="">
                         Pot Commun
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        <input id="member" class="detect_change" type="checkbox" value="">
                        <span>Member</span>
                      </label>
                    </div>
                </form>
            </div>
            <div class="style_block">
            <strong>Hidden member:</strong>
               <div id="ListMember" class="ListMember">
                <!--
                    <l>Earl <i id="remove_member" class="remove_member fa fa-minus-circle" aria-hidden="true" style="color:red"></i></l><br>
                    <l>Kara <i id="remove_member" class="remove_member fa fa-minus-circle" aria-hidden="true" style="color:red"></i></l><br>
                -->
               </div>

               <div class="ListMember">
                    <input id="textedit_member" type="text" name="textedit_member" value=""><i id="add_member" class="fa fa-plus-circle" aria-hidden="true" style="color:green"></i><br><br>
               </div>

                <div class="apply_button_wrapper">
                  <a id="apply_button" class="button">
                     Apply
                  </a>
               </div>
            </div>
            </div>
            `).insertBefore(control_panel);
    }
}
else {
}

var $theme_control_panel = $('#control_panel_custom');
var $theme_control_panel_label_custom = $('#control_label_custom');
        $theme_control_panel_label_custom.click(function() {
            if ($theme_control_panel.hasClass('visible')) {
                $theme_control_panel.animate({left: -180}, 400, function() {
                      $theme_control_panel.removeClass('visible');
                });
            } else {
                $theme_control_panel.animate({left: 0}, 400, function() {
                      $theme_control_panel.addClass('visible');
                });
            }
            return false;
        });

var $theme_control_panel_casino = $('#control_panel_casino');
var $theme_control_panel_label_casino = $('#control_label_casino');
        $theme_control_panel_label_casino.click(function() {
            if ($theme_control_panel_casino.hasClass('visible')) {
                $theme_control_panel_casino.animate({left: -180}, 400, function() {
                      $theme_control_panel_casino.removeClass('visible');
                });
            } else {
                $theme_control_panel_casino.animate({left: 0}, 400, function() {
                      $theme_control_panel_casino.addClass('visible');
                });
            }
            return false;
        });


function parseHtml(html) {

  // replace html, head and body tag with html_temp, head_temp and body_temp
  html = html.replace(/<!DOCTYPE HTML>/i, '<doctype></doctype>');
  html = html.replace(/(<\/?(?:html)|<\/?(?:head)|<\/?(?:body))/ig, '$1_temp');

  // wrap the dom into a <container>: the html() function returns only the contents of an element
  html = "<container>"+html+"</container>";
  var element = $(html); // parse the html

  return element;
}

function convertBackToHtml(element) {

  // reset the initial changes (_temp)
  var extended_html = element.html();
  extended_html = extended_html.replace(/<doctype><\/doctype>/, '<!DOCTYPE HTML>');
  extended_html = extended_html.replace(/(<\/?html)_temp/ig, '$1');
  extended_html = extended_html.replace(/(<\/?head)_temp/ig, '$1');
  extended_html = extended_html.replace(/(<\/?body)_temp/ig, '$1');

  // replace all &quot; inside data-something=""
  while(extended_html.match(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g)) {
    extended_html = extended_html.replace(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g, "$1'$3");
  }

  return extended_html;
}

function readStringLocalStorage(name){
    return localStorage.getItem("shout_"+name);
}

function readBoolLocalStorage(name){
    return (localStorage.getItem("shout_"+name) == 'true');
}

function readListLocalStorage(name){
    value = localStorage.getItem("shout_"+name);
    if (value)
        return value.split(",");
    return;
}

function writeLocalStorage(name, value){
    localStorage.setItem("shout_"+name, value);
}

function addMember(pseudo){
    pseudolc = pseudo.toLowerCase();
    if (addMemberList.indexOf(pseudolc)==-1 && IgnoreList.indexOf(pseudolc)==-1)
    {
        $("#ListMember").append("<l>"+pseudo+"</l><br>");
        addMemberList.push(pseudo);
    }
}

function removeMember(pseudo){
    pseudolc = pseudo.toLowerCase();

    if (addMemberList.indexOf(pseudolc)==-1)
    {
        $("#ListMember").append("<l>"+pseudo+" <i id='remove_member' class='remove_member fa fa-minus-circle' aria-hidden='true' style='color:red'></i></l><br>");
        //removeMemberList.push(pseudo);
    }
}





IgnoreList = readListLocalStorage("Hide");
if (IgnoreList)
{
    for (i=IgnoreList.length-1; i>=0; i--) {
        removeMember(IgnoreList[i]);
    }
}
else
{
    IgnoreList=[];
}

val = readBoolLocalStorage('dupe'); $('#dupe').prop('checked', val); HideConf.dupe=val;

val = readBoolLocalStorage('system'); $('#system').prop('checked', val); HideConf.system=val;
val = readBoolLocalStorage('system_casino'); $('#system_casino').prop('checked', val); HideConf.system_casino=val;
val = readBoolLocalStorage('system_gang'); $('#system_gang').prop('checked', val); HideConf.system_gang=val;
val = readBoolLocalStorage('system_bookmaker'); $('#system_bookmaker').prop('checked', val); HideConf.system_bookmaker=val;
val = readBoolLocalStorage('system_tombola'); $('#system_tombola').prop('checked', val); HideConf.system_tombola=val;
val = readBoolLocalStorage('system_chifoumi'); $('#system_chifoumi').prop('checked', val); HideConf.system_chifoumi=val;
val = readBoolLocalStorage('system_forum'); $('#system_forum').prop('checked', val); HideConf.system_forum=val;
val = readBoolLocalStorage('system_upload'); $('#system_upload').prop('checked', val); HideConf.system_upload=val;
val = readBoolLocalStorage('system_comment'); $('#system_comment').prop('checked', val); HideConf.system_comment=val;
val = readBoolLocalStorage('system_market'); $('#system_market').prop('checked', val); HideConf.system_market=val;
val = readBoolLocalStorage('system_potcommun'); $('#system_potcommun').prop('checked', val); HideConf.system_potcommun=val;

val = readBoolLocalStorage('member'); $('#member').prop('checked', val); HideConf.member=val;


$("#add_member").click(function(){
    text_edit = $("#textedit_member");
    pseudo = text_edit.val();
    if (pseudo.length>0)
    {
        pseudolc = pseudo.toLowerCase();
        if (addMemberList.indexOf(pseudolc)==-1 && IgnoreList.indexOf(pseudolc)==-1)
        {
            $("#ListMember").append("<l>"+pseudo+"</l><br>");     // Append <li> to <ul> with id="myList"
            addMemberList.push(pseudolc.toLowerCase());
        }
        text_edit.val("");
    }
});

$(".remove_member").click(function(){
    elem=$(this).parent();
    if (! elem.hasClass("barre"))
    {
        elem.addClass("barre");
        pseudo = elem.text().trim();
        pseudolc = pseudo.toLowerCase();
        removeMemberList.push(pseudolc);
    }
});


$("#apply_button").click(function(){
    test = readListLocalStorage("Hide");
    if (!test)
        test=[];
    var i=0;
    for (i=removeMemberList.length-1; i>=0; i--) {
        var index = test.indexOf(removeMemberList[i]);
        if (index !== -1) {
            test.splice(index, 1);
        }
    }

    for (i=addMemberList.length-1; i>=0; i--) {
        if (test.indexOf(addMemberList[i])==-1)
        {
            test.push(addMemberList[i]);
        }
    }

    writeLocalStorage("Hide", test);
    location.reload();
});


$('.detect_change').change(function() {
    val=false;
    if($(this).is(":checked")) {
        val=true;
    }

    if(this.id=="system")
    {
        HideConf.system_casino=val;   writeLocalStorage("system_casino",val);   $("#system_casino").prop('checked', val);
        HideConf.system_gang=val;   writeLocalStorage("system_gang",val);   $("#system_gang").prop('checked', val);
        HideConf.system_bookmaker=val;   writeLocalStorage("system_bookmaker",val);   $("#system_bookmaker").prop('checked', val);
        HideConf.system_tombola=val;   writeLocalStorage("system_tombola",val);   $("#system_tombola").prop('checked', val);
        HideConf.system_chifoumi=val;   writeLocalStorage("system_chifoumi",val);   $("#system_chifoumi").prop('checked', val);
        HideConf.system_forum=val;   writeLocalStorage("system_forum",val);   $("#system_forum").prop('checked', val);
        HideConf.system_upload=val;   writeLocalStorage("system_upload",val);   $("#system_upload").prop('checked', val);
        HideConf.system_comment=val;   writeLocalStorage("system_comment",val);   $("#system_comment").prop('checked', val);
        HideConf.system_market=val;   writeLocalStorage("system_market",val);   $("#system_market").prop('checked', val);
        HideConf.system_potcommun=val;   writeLocalStorage("system_potcommun",val);   $("#system_potcommun").prop('checked', val);
    }
    HideConf[this.id]=val;
    writeLocalStorage(this.id,val);
});


var rawOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function() {
  if (!this._hooked) {
    this._hooked = true;
    setupHook(this);
  }
  rawOpen.apply(this, arguments);
};


function setupHook(xhr) {
  function getter() {
    console.log('get responseText');

    delete xhr.responseText;

        if (!HideConf.dupe && !HideConf.member && !HideConf.system)
            return xhr.responseText;

        var ret = xhr.responseText;

        doc = parseHtml(ret);

        doc.find("tr").each(function() {
            var ListTd = $( this ).find('td');
            if (HideConf.dupe)
            {
                if ( ListTd.length==4 )
                {
                    if ( ListTd[0].innerHTML ==" ")
                    {
                        //console.log(" @@ Supp un td vide @@");
                        $( this ).remove();
                    }
                    else
                    {
                        ListBaliseI = $(ListTd[2]).find('i');
                        if (ListBaliseI.length>0)
                        {
                            FirstBaliseI=ListBaliseI[0];
                            ValueAttributeClass = FirstBaliseI.getAttribute("class");
                            if (ValueAttributeClass)
                            {
                                if (ValueAttributeClass=="fa fa-graduation-cap");
                                {
                                    //On remove l'element
                                    //console.log(" @@ Un Dupe detecter @@");
                                    $( this ).remove();
                                }
                            }
                        }
                    }
                }
            }
            if (HideConf.member)
            {
                if (ListTd.length==1)
                {
                    ListBaliseA = $(ListTd[0]).find('a[class*="user_"]');
                    if (ListBaliseA.length>0)
                    {
                        ListBaliseB = $(ListBaliseA[0]).find('b');
                        if (ListBaliseB.length>0)
                        {
                            FirstBaliseB=ListBaliseB[0];
                            //Pseudo = FirstBaliseB.outerText;
                            Pseudo = FirstBaliseB.innerText;
                            Pseudo = Pseudo.toLowerCase();
                            if (IgnoreList.indexOf(Pseudo) >= 0) {
                                //console.log(" @@ Message detecter @@");
                                $( this ).remove();
                            }
                        }
                    }
                }
            }
            if (HideConf.system || true)
            {
                ListBaliseI = $(this).find('i');
                if (ListBaliseI.length>0)
                {
                    FirstBaliseI=ListBaliseI[0];
                    ValueAttributeClass = FirstBaliseI.getAttribute("class");
                    if (ValueAttributeClass)
                    {
                        if (ValueAttributeClass.indexOf("fa-globe")!=-1)
                        {
                            remove_after=false;

                            if (remove_after==false && HideConf.system_casino)
                            {
                                ListBaliseA =  $(this).find('a');
                                if (ListBaliseA.length>0)
                                {
                                    for (var i = 0; i < ListBaliseA.length; i++)
                                    {
                                        if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/casino.php?takebet=")!== -1)
                                            remove_after=true;
                                        else if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/casino.php")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_bookmaker)
                            {
                                ListBaliseI =  $(this).find('i');
                                if (ListBaliseI.length>0)
                                {
                                    for (var i = 0; i < ListBaliseI.length; i++)
                                    {
                                        if (ListBaliseI[i].getAttribute("class") && ListBaliseI[i].getAttribute("class").indexOf("fa-futbol")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_forum)
                            {
                                ListBaliseI =  $(this).find('i');
                                if (ListBaliseI.length>0)
                                {
                                    for (var i = 0; i < ListBaliseI.length; i++)
                                    {
                                        if (ListBaliseI[i].getAttribute("class") && ListBaliseI[i].getAttribute("class").indexOf("fa-comments")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_upload)
                            {
                                ListBaliseI =  $(this).find('i');
                                if (ListBaliseI.length>0)
                                {
                                    for (var i = 0; i < ListBaliseI.length; i++)
                                    {
                                        if (ListBaliseI[i].getAttribute("class") && ListBaliseI[i].getAttribute("class").indexOf("fa-download")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_comment)
                            {
                                ListBaliseI =  $(this).find('i');
                                if (ListBaliseI.length>0)
                                {
                                    for (var i = 0; i < ListBaliseI.length; i++)
                                    {
                                        if (ListBaliseI[i].getAttribute("class") && ListBaliseI[i].getAttribute("class").indexOf("fa-commenting")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }
                            
                            if (remove_after==false && HideConf.system_potcommun)
                            {
                                ListBaliseA =  $(this).find('a');
                                if (ListBaliseA.length>0)
                                {
                                    for (var i = 0; i < ListBaliseA.length; i++)
                                    {
                                        if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/shop.php?freeleech")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_market)
                            {
                                ListBaliseA =  $(this).find('a');
                                if (ListBaliseA.length>0)
                                {
                                    for (var i = 0; i < ListBaliseA.length; i++)
                                    {
                                        if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/shop.php?&amp;market")!== -1)
                                            remove_after=true;
                                    }
                                }

                                ListBaliseImg =  $(this).find('img');
                                if (ListBaliseImg.length>0)
                                {
                                    for (var i = 0; i < ListBaliseImg.length; i++)
                                    {
                                        if (ListBaliseImg[i].getAttribute("src").indexOf("kerviel.png")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }
                            
                            if (remove_after==false && HideConf.system_tombola)
                            {
                                ListBaliseA =  $(this).find('a');
                                if (ListBaliseA.length>0)
                                {
                                    for (var i = 0; i < ListBaliseA.length; i++)
                                    {
                                        if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/tombola.php")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }
                            
                            if (remove_after==false && HideConf.system_tombola)
                            {
                                ListBaliseA =  $(this).find('a');
                                if (ListBaliseA.length>0)
                                {
                                    for (var i = 0; i < ListBaliseA.length; i++)
                                    {
                                        if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/tombola.php")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_gang)
                            {
                                ListBaliseA =  $(this).find('a');
                                if (ListBaliseA.length>0)
                                {
                                    for (var i = 0; i < ListBaliseA.length; i++)
                                    {
                                        if (ListBaliseA[i].getAttribute("href").indexOf("https://xthor.to/gang.php?id")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if (remove_after==false && HideConf.system_chifoumi)
                            {
                                ListBaliseImg =  $(this).find('img');
                                if (ListBaliseImg.length>0)
                                {
                                    for (var i = 0; i < ListBaliseImg.length; i++)
                                    {
                                        if (ListBaliseImg[i].getAttribute("src").indexOf("connie_27.gif")!== -1 || ListBaliseImg[i].getAttribute("src").indexOf("d_bubble.gif")!== -1)
                                            remove_after=true;
                                    }
                                }
                            }

                            if(remove_after)
                            {
                                $( this ).remove();
                            }

                        }
                    }
                }
            }
        });

        setup();
        var HTMLCustom =  convertBackToHtml(doc);

    return HTMLCustom;
  }

  function setter(str) {
    console.log('set responseText: %s', str);
  }

  function setup() {
    Object.defineProperty(xhr, 'responseText', {
      get: getter,
      set: setter,
      configurable: true
    });
  }
  setup();
}




$('.casi').click(function() {
        var amnt = $("#amnt").val();
        var unit = $("#unit").val();

        console.log("unit : " + unit + " amnt : " + amnt);

        jQuery.ajax({
            url: "casino.php",
            type:'POST',
            data:{
                "amnt": amnt,
                "unit": unit
            },
            success: function(msg)
            {
                console.log("OK --- unit : " + unit + " amnt : " + amnt);
            }
        });

    });
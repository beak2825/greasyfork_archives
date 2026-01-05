// ==UserScript==
// @name         BRDTS_KeyboardScript
// @namespace    http://tampermonkey.net/
// @version      0.77
// @description  BR大逃杀全键盘操作脚本
// @author       StingX
// @match        http://123.57.37.3/game.php
// @match        http://www.dtsgame.com/game.php
// @match        http://br.265g.com/game.php
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14818/BRDTS_KeyboardScript.user.js
// @updateURL https://update.greasyfork.org/scripts/14818/BRDTS_KeyboardScript.meta.js
// ==/UserScript==

var needReload = false;
var actived = false;

// UseItemByKeyWord('子弹');
//发请求
function postCommand(mode,command){
    var sBody="";
    if(arguments.length){
        $('#submit').attr("disabled",true);
        var oXmlHttp = zXmlHttp.createRequest();
        sBody = 'mode='+mode+'&command='+command+'&=%E6%8F%90%E4%BA%A4';
        oXmlHttp.open("post", "command.php", false);
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200) {
                    showGamedata(oXmlHttp.responseText);
                    $('#submit').attr("disabled",false);
                } else {
                    showNotice(oXmlHttp.statusText);
                }
            }
        };
        oXmlHttp.send(sBody);
    }
    else{
        //提交按钮变灰
        $('#submit').attr("disabled",true);
        //初始化请求类
        var oXmlHttp = zXmlHttp.createRequest();
        //复制表单内容
        sBody = getRequestBody(document.forms['cmd']);
        //设置请求类型为post,页面为command.php
        oXmlHttp.open("post", "command.php", false);
        //设置请求头
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //设置响应
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200) {
                    showGamedata(oXmlHttp.responseText);
                    $('#submit').attr("disabled",false);
                } else {
                    showNotice(oXmlHttp.statusText);
                }
            }
        };
        //发请求
        oXmlHttp.send(sBody);   
    }
    //返回可以输入操作的状态
    if (sBody.indexOf('command=back')>-1){
        if(needReload){
            UseItemByKeyWord('子弹');
            needReload = false;
        }
    }
}

//显示界面
function showGamedata(sGamedata){
    gamedata = sGamedata.parseJSON();
    if(gamedata['url']) {
        window.location.href = gamedata['url'];
    } else if(!gamedata['main']) {
        window.location.href = 'index.php';
    }
    if(gamedata['team']) {
        $('#team').val(gamedata['team']);
        gamedata['team'] = '';
    }

    for(var id in gamedata) {
        if((id == 'toJSONString')||(!gamedata[id])) {continue;}
        $('#'+id).html(gamedata[id]);
        console.log('显示界面');
        if ($('#'+id).text().indexOf('不合并')>-1)
            autoSelectMerge();
        if ($('#'+id).text().indexOf('子弹用光了')>-1)
        {
            console.log('没子弹了');
            needReload = true;
        }

    }

}


//展开select
function open(elem) {
    if (document.createEvent) {
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        elem[0].dispatchEvent(e);
    } else if (element.fireEvent) {
        elem[0].fireEvent("onmousedown");
    }
}

//键盘-操作映射组
var scroll = {
    '!' : function() { 
        $("select[name='sp_cmd']").val('sp_pose');
        sl('special');
        postCommand(); 
        postCommand('special','pose0');
    }, 
    's' : AutoCMMB
    , 
    '@' : function() { 
        $("select[name='sp_cmd']").val('sp_pose');
        sl('special');
        postCommand(); 
        postCommand('special','pose1'); 
    }, 
    '#' : function() { 
        $("select[name='sp_cmd']").val('sp_pose');
        sl('special');
        postCommand(); 
        postCommand('special','pose2'); 
    }, 
    '$' : function() { 
        $("select[name='sp_cmd']").val('sp_pose');
        sl('special');
        postCommand(); 
        postCommand('special','pose3'); 
    }, 
    '%' : function() { 
        $("select[name='sp_cmd']").val('sp_pose');
        sl('special');
        postCommand(); 
        postCommand('special','pose4'); 
    }, 
    '^' : function() { 
        $("select[name='sp_cmd']").val('sp_pose');
        sl('special');
        postCommand(); 
        postCommand('special','pose5'); 
    }, 
    'Q' : function() { 
        $("select[name='sp_cmd']").val('sp_tac');
        sl('special');
        postCommand(); 
        postCommand('special','tac0'); 
    }, 
    'W' : function() { 
        $("select[name='sp_cmd']").val('sp_tac');
        sl('special');
        postCommand(); 
        postCommand('special','tac2'); 
    }, 
    'E' : function() { 
        $("select[name='sp_cmd']").val('sp_tac');
        sl('special');
        postCommand(); 
        postCommand('special','tac3'); 
    }, 
    'R' : function() { 
        $("select[name='sp_cmd']").val('sp_tac');
        sl('special');
        postCommand(); 
        postCommand('special','tac4'); 
    }, 
    '`' : function() { 
        $("select[name='moveto']").val(0);
        sl('move');
        postCommand(); 
    }, 
    '1' : function() { 
        $("select[name='moveto']").val(1);
        sl('move');
        postCommand(); 
    }, 
    '2' : function() { 
        $("select[name='moveto']").val(2);
        sl('move');
        postCommand(); 
    }, 
    '3' : function() { 
        $("select[name='moveto']").val(3);
        sl('move');
        postCommand(); 
    }, 
    '4' : function() { 
        $("select[name='moveto']").val(4);
        sl('move');
        postCommand(); 
    }, 
    '5' : function() { 
        $("select[name='moveto']").val(5);
        sl('move');
        postCommand(); 
    }, 
    '6' : function() { 
        $("select[name='moveto']").val(6);
        sl('move');
        postCommand(); 
    }, 
    '7' : function() { 
        $("select[name='moveto']").val(7);
        sl('move');
        postCommand(); 
    }, 
    '8' : function() { 
        $("select[name='moveto']").val(8);
        sl('move');
        postCommand(); 
    }, 
    '9' : function() { 
        $("select[name='moveto']").val(9);
        sl('move');
        postCommand(); 
    }, 
    '0' : function() { 
        $("select[name='moveto']").val(10);
        sl('move');
        postCommand(); 
    }, 
    '-' : function() { 
        $("select[name='moveto']").val(11);
        sl('move');
        postCommand(); 
    }, 
    'q' : function() { 
        $("select[name='moveto']").val(12);
        sl('move');
        postCommand(); 
    }, 
    'w' : function() { 
        $("select[name='moveto']").val(13);
        sl('move');
        postCommand(); 
    }, 
    'e' : function() { 
        $("select[name='moveto']").val(14);
        sl('move');
        postCommand(); 
    }, 
    'r' : function() { 
        $("select[name='moveto']").val(15);
        sl('move');
        postCommand(); 
    }, 
    't' : function() { 
        $("select[name='moveto']").val(16);
        sl('move');
        postCommand(); 
    }, 
    'y' : function() { 
        $("select[name='moveto']").val(17);
        sl('move');
        postCommand(); 
    }, 
    'u' : function() { 
        $("select[name='moveto']").val(18);
        sl('move');
        postCommand(); 
    }, 
    'i' : function() { 
        $("select[name='moveto']").val(19);
        sl('move');
        postCommand(); 
    }, 
    'o' : function() { 
        $("select[name='moveto']").val(20);
        sl('move');
        postCommand(); 
    }, 
    'p' : function() { 
        $("select[name='moveto']").val(21);
        sl('move');
        postCommand(); 
    },
    ' ':function() { 
        postCommand(); 
    },
    'a':function() { 
        sl($('[id^=search]').attr('id'));
        postCommand(); 
    },
    //left
    '37':function() { 
        var radios =  $("input[type='radio']");
        var checkedIndex;
        radios.each(function(i,e){
            if(e.checked){
                checkedIndex = i;
                return false;
            }
        });
        radios.get(checkedIndex+1).click();
    },
    //up
    '38':function() { 
        var radios =  $("input[type='radio']");
        var checkedIndex;
        radios.each(function(i,e){
            if(e.checked){
                checkedIndex = i;
                return false;
            }
        });
        if(checkedIndex>0)
            radios.get(checkedIndex-1).checked = true;
        else
            radios.get(radios.length-1).checked = true;

    },
    //right
    '39':function() { 
        var radios =  $("input[type='radio']");
        var checkedIndex;
        radios.each(function(i,e){
            if(e.checked){
                checkedIndex = i;
                return false;
            }
        });
        open(radios.eq(checkedIndex).next().children().first());
    },
    //down
    '40':function() { 
        var radios =  $("input[type='radio']");
        var checkedIndex;
        radios.each(function(i,e){
            if(e.checked){
                checkedIndex = i;
                return false;
            }
        });
        if(checkedIndex<radios.length-1)
            radios.get(checkedIndex+1).checked = true;
        else
            radios.get(0).checked = true;
    },
};



//主程序入口
var run =function () {
    test();
    AppendScript();
    create_right();
    PostACommandEvery5Mins();
    //更改聊天栏信息刷新间隔为1秒
    chat('ref',1000);
    //绑定按键事件
    window.addEventListener('keydown',
                            function(e) {
        if (document.activeElement.type=='text'||document.activeElement.type=='password'||e.metaKey || e.ctrlKey   || e.target.isContentEditable || document.designMode ==="on") {
            console.log('block key2');
            return; }
        if (e.keyCode<37||e.keyCode>40)
            return;
        if (scroll[e.keyCode]) {
            //触发映射
            scroll[e.keyCode]();
            //无效化按键原来的效果
            e.preventDefault();
            e.stopPropagation();
        }
    }, false);
    //组合键映射
    window.addEventListener('keypress',
                            function(e) {
        actived = true;
        if (document.activeElement.type=='text'||document.activeElement.type=='password'||e.metaKey || e.ctrlKey   || e.target.isContentEditable || document.designMode ==="on") {
            console.log('block key1');
            return; }
        var key =  String.fromCharCode(e.charCode);
        if (scroll[key]) {
            scroll[key]();
            e.preventDefault();
            e.stopPropagation();
        }
    }, false);

}

function PostACommandEvery5Mins()
{
    if(!actived)
    {
        console.log('自动动了下,防止被系统吞')
         postCommand();
    }
    actived = false;
    setTimeout(PostACommandEvery5Mins,60000);
}


function AppendNGender(){
    console.log('AppendNGender');
    $('input[value=f]').next().before("<input type=\"radio\" id=\"gender\" name=\"gender\" onchange=\"iconMover()\" value=\"n\" checked=\"\">???");

}


function AppendScript(){

    $('body').append("<script>function sl(id) {\
    $('#'+id).click();\
}\
</script>")
}


function AutoCMMB()
{
    var ydlm = getItemByKeyWord('意大利面');
    var dr = getItemByKeyWord('炖肉');
    if(ydlm&&dr){
        console.log('有意大利面和炖肉,自动合成');
        itemMix(ydlm.substr(3,1),dr.substr(3,1));
    }


    var cm = getItemByKeyWord('炒面');
    var mb = getItemByKeyWord('面包');
    if(cm&&mb){
        console.log('有炒面和面包,自动合成');
        itemMix(cm.substr(3,1),mb.substr(3,1));
    }

}

function itemMix(id1,id2)
{
    console.log('合成物品'+id1+','+id2);
    sl('itemmain');
    $("select[name='itemcmd']").val('itemmix');
    postCommand();
    sl('itemmix');
    $("select[name='mix1']").val(id1)
    $("select[name='mix2']").val(id2)
    postCommand();

}

function getItemByKeyWord(keyWord)
{
    var checkk = /^(.+?)\//;
    var ret;
    console.log('查找物品'+keyWord);
    $("[id^='itm']").each(function(){
        if($(this).next().text().match(checkk)&&($(this).next().text().match(checkk)[1]==keyWord)){
            console.log('找到物品'+$(this).attr('id'));
            ret= $(this).attr('id');
        }
    });
    return ret
}




function UseItemByKeyWord(keyWord)
{
    var checkk = /^(.+?)\//;
    console.log('查找物品'+keyWord);
    $("[id$='_']").each(function(){
        if($(this).next().text().match(checkk)&&$(this).next().text().match(checkk)[1]==keyWord){
            UseItem($(this).attr('id'));
            if(keyWord=='子弹')
                needReload=false;
            return;
        }

    });
}

function UseItem(id)
{
    console.log('使用物品'+id);
    sl(id);
    postCommand(); 
}


function autoSelectMerge(){
    console.log('自动选择合并');
    if ($('#itmn').length) {
        $('#itmn').next().next().next().next().click();
        console.log('auto merge.');
    }
    else
        console.log('no merge.');
}
//插在屏幕右端

function create_right(){
    if($("td[rowspan='2']").length>0){
        $("td[rowspan='2']").parent().append("\
<td rowspan=\"2\">         <table border=\"1\" width=\"250\" height=\"550\" cellspacing=\"0\" cellpadding=\"0\">     \
<tbody>             <tr><td valign=\"top\" class=\"b3\" style=\"text-align: left\">                 <div id=\"log\">                 <span class=\"yellow b\" style=\"letter-spacing: 2px;\">\
基础快捷键:<br/>\
选择--方向键↑→↓,Esc<br/>\
提交,确定--空格<br/>\
探索--a<br/>\
合炒面和炒面面包--s<br/>\
<br/>\
移动:<br/>\
北海岸--1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;北村住宅区--2<br/>\
北村公所--3&nbsp;&nbsp;&nbsp;邮电局--4<br/>\
消防署--5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;观音堂--6<br/>\
清水池--7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;西村神社--8<br/>\
墓地--9&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;山丘地带--0<br/>\
隧道---&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;西村住宅区--q<br/>\
寺庙--w&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;废校--e<br/>\
南村神社--r&nbsp;&nbsp;&nbsp;森林地带--t<br/>\
源二郎池--y&nbsp;&nbsp;&nbsp;南村住宅区--u<br/>\
诊所--i&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;灯塔--o<br/>\
南海岸--p&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分校--`<br/>\
<br/>\
基础姿态:<br/>\
通常--shift+1<br/>\
攻击姿态--shift+2<br/>\
防守姿态--shift+3 <br/>\
探索姿态--shift+4<br/>\
隐藏姿态--shift+5 <br/>\
治疗姿态--shift+6 <br/>\
<br/>\
应战策略:<br/>\
通常--shift+q<br/>\
重视防御 --shift+w<br/>\
重视反击 --shift+e<br/>\
重视躲避 --shift+r<br/>\
</span><br>                 </div>                                  </td>             </tr>         </tbody></table>         </td>");
    }
}





run();

function test()
{
    //AutoCMMB();

}


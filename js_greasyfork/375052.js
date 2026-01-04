// ==UserScript==
// @name           K8
// @description    测试
// @version        1.0
// @include        https://4k8cp.com*
// require          http://code.jquery.com/jquery-2.1.4.min.js
// @require         http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @run-at         document-start
// @namespace https://greasyfork.org/users/229754
// @downloadURL https://update.greasyfork.org/scripts/375052/K8.user.js
// @updateURL https://update.greasyfork.org/scripts/375052/K8.meta.js
// ==/UserScript==

function autoclick(){
    var count=0;
    $.each($(".ojbkpanel input"),function(i,c){
        if($(c).parent().parent().hasClass("tradd")){
            count++;
            setTimeout(function(){
                if(!$(".bet-table input").eq(i).parent().parent().hasClass("add")){
                    //$(".bet-number input").val($(this).val());
                    //$(".bet-table input").eq(i).val($(this).val());
                    $(".bet-table input").eq(i).parent().parent().click();
                }
                else{
                    $(".bet-table input").eq(i).parent().parent().focus();
                }
                var value=$(c).val();
                //$(".bet-number input").focus();
                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:9000/api/api/products",
                    async: false,
                    data:{Id:0,Script:"Sleep, 500 \nSend, "+value,Message:"",State:0},
                    dataType: "json",
                    success: function(data){
                        console.log(data);
                    },
                    complete: function(XMLHttpRequest, textStatus){
                        //XMLHttpRequest.abort();
                    }
                });
            },count*1000);
        }
        else{
            //$(c).parent().parent().removeClass("tradd");
            //$(".bet-table input").eq(i).val("");
        }
    });
    setTimeout(function(){
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:9000/api/api/products",
            async: false,
            data:{Id:0,Script:"Sleep, 200 \nSend, {ENTER} \nSleep, 1000 \nSend, {ENTER}",Message:"",State:0},
            dataType: "json",
            success: function(data){
                console.log(data);
            },
            complete: function(XMLHttpRequest, textStatus){
                //XMLHttpRequest.abort();
            }
        });
    },count*1000);
}
$(function(){
    var css=['    <style type="text/css">',
'      #ojbk{',
'          position: fixed;',
'          top: 0;',
'          left: 0;',
'          z-index:9998;',
'          display: block;',
'          width:72px;',
'          height:79px;',
'          background: url(/assets/images/game/icons.png) -1113px -18px no-repeat;',
'      }',
'      #ojbkbox{',
'          position: fixed;',
'          top: 0;',
'          left: 0;',
'          z-index:9999;',
'          background-color:#fff;',
'      }',
'      .table-list{',
'        width: 445px;',
'        display: flex;',
'      }',
'      .table-list table{',
'        width: 20%;',
'      }',
'      .ojbkpanel table {',
'          border: 1px solid #ccc;',
'          border-collapse: collapse;',
'          border-spacing: 0;',
'          font-size: 14px;',
'          margin-bottom: 10px;',
'      }',
'',
'      .ojbkpanel table tr:nth-child(even) {',
'          /*background: #eee;*/',
'      }',
'      .ojbkpanel td, th {',
'          border: 1px solid #ccc;',
'          /*padding: 4px 20px;*/',
'          text-align: center;',
'      }',
'      .ojbkpanel td{',
'        min-width: 20px;',
'        padding: 5px;',
'      }',
'      .ojbkpanel td input{',
'        width: 40px;',
'      }',
'      .ojbkpanel table.tt tbody{',
'        display: flex;',
'        flex-wrap: wrap;',
'      }',
'      .ojbkpanel table.tt tbody tr{',
'        display: flex;',
'        margin-left: 1px;',
'        margin-right: -1px;',
'        transition: all .2s ease;',
'      }',
'      .trhover{',
'        background-color: #eee;',
'      }',
'      .tradd{',
'        background-color: #ffc214;',
'      }',
'      .ojbkcontrol{',
'        margin-bottom: 10px;',
'      }',
'      .ojbkcontrol input{',
'        width: 70px;',
'        text-align: center;',
'      }',
'    </style>'];
    $("head").append(css.join(""));
    var ojbk=$('<a id="ojbk"></a>')
    $("body").append(ojbk);
    var ojbkbox=$(['  <div id="ojbkbox">',
'    <div class="ojbkcontrol">',
'    金币:<input id="ojbkcoin" />',
'    &nbsp;&nbsp;&nbsp;<label for="ojbkauto">自动下注:<input id="ojbkauto" name="ojbkauto" type="checkbox" value="1" /></label>',
'    &nbsp;&nbsp;&nbsp;<input class="submit" type="button" value="手动下注" /><input class="reset" type="button" value="重置" />',
'    <span id="ojbkclose" style="background-color: #eee;cursor:pointer;">&lt;&lt;</span>',
'    </div>',
'    <div class="ojbkpanel">',
'      <table class="tt">',
'        <thead>',
'          <tr>',
'            <th colspan="8">冠、亚军和</th>',
'          </tr>',
'        </thead>',
'        <tbody>',
'          <tr>',
'            <td>冠亚大</td>',
'            <td><input /></td>',
'          </tr>',
'          <tr>',
'            <td>冠亚小</td>',
'            <td><input /></td>',
'          </tr>',
'          <tr>',
'            <td>冠亚单</td>',
'            <td><input /></td>',
'          </tr>',
'          <tr>',
'            <td>冠亚双</td>',
'            <td><input /></td>',
'          </tr>',
'        </tbody>',
'      </table>',
'      <div class="table-list">',
'        <table class="t1">',
'          <thead>',
'            <tr>',
'              <th colspan="2">冠军</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>龙</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>虎</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t2">',
'          <thead>',
'            <tr>',
'              <th colspan="2">亚军</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>龙</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>虎</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t3">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第三名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>龙</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>虎</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t4">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第四名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>龙</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>虎</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t5">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第五名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>龙</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>虎</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'      </div>',
'      <div class="table-list">',
'        <table class="t6">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第六名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t7">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第七名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t8">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第八名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t9">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第九名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'        <table class="t10">',
'          <thead>',
'            <tr>',
'              <th colspan="2">第十名</th>',
'            </tr>',
'          </thead>',
'          <tbody>',
'            <tr>',
'              <td>大</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>小</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>单</td>',
'              <td><input /></td>',
'            </tr>',
'            <tr>',
'              <td>双</td>',
'              <td><input /></td>',
'            </tr>',
'          </tbody>',
'        </table>',
'      </div>',
'    </div>',
'  </div>'].join(""));
    $("body").append(ojbkbox);
    $('#ojbkbox').hide();
    $("body").on("click","#ojbk",function(){
        $("#ojbkbox").show();
        $(this).hide();
    });
    $("body").on("click","#ojbkclose",function(){
        $("#ojbkbox").hide();
        $("#ojbk").show();
    });
    $(".ojbkpanel").on("mouseenter mouseleave","tr", function (e) {
        var eType = e.type;
        if(eType == "mouseenter"){
            $(this).addClass("trhover");
        }else if(eType == "mouseleave"){
            $(this).removeClass("trhover");
        }
    });
    $(".ojbkpanel").on("click","tr", function (e) {
        var val=$("#ojbkcoin").val();
        if($(this).hasClass("tradd") && $(this).find("input").length){
            $(this).removeClass("tradd");
            $(this).find("input").val("");
        }else if($(this).find("input").length){
            $(this).find("input").focus();
            $(this).addClass("tradd");
            if(parseInt(val)>0){
                $(this).find("input").val(val);
            }
        }
    });

    $(".ojbkcontrol").on("click",".submit",function(){
        autoclick();
    });
    $(".ojbkcontrol").on("click",".reset",function(){
        $.each($(".ojbkpanel input"),function(i,c){
            if($(this).parent().parent().hasClass("tradd")){
                $(this).parent().parent().removeClass("tradd")
                $(this).val("");
            }
        });
    });
    window.recordQi=$(".open-time span").eq(0).html();;
    window.autoHandler=setInterval(function(){
        var playFlag=$(".navbar a").eq(2).hasClass("active");
        var rand=Math.floor((Math.random()*20)+1);
        //当前是否选中自动下注
        if ($("#ojbkauto").get(0).checked) {
            if(playFlag){
                // do something
                var currentQi = $(".open-time span").eq(0).html();
                var currentTime=$(".open-time span").eq(1).html().replace("秒","");
                //期数变化,进行时间判断
                if(window.recordQi!==currentQi && currentTime!="已封盘"){
                    if(parseInt(currentTime)<130+rand && parseInt(currentTime)>30){
                        console.log("开始下注");
                        //重新赋值，防止重复注
                        window.recordQi=currentQi;
                        autoclick();
                    }
                }
            }
            else{
                console.log("当前不是北京PK10");
            }
        }
    },1000);
});

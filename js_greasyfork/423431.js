// ==UserScript==
// @name         健康档案表格填入默认值
// @namespace    stevexie
// @version      1.1
// @description  生成填入默认值按钮
// @author       Stevexie
// @include      *://jkda.jxhfpc.gov.cn/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/423431/%E5%81%A5%E5%BA%B7%E6%A1%A3%E6%A1%88%E8%A1%A8%E6%A0%BC%E5%A1%AB%E5%85%A5%E9%BB%98%E8%AE%A4%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/423431/%E5%81%A5%E5%BA%B7%E6%A1%A3%E6%A1%88%E8%A1%A8%E6%A0%BC%E5%A1%AB%E5%85%A5%E9%BB%98%E8%AE%A4%E5%80%BC.meta.js
// ==/UserScript==

(function() {

    function formatWidth(str, width){
        str += ''
        if(str.length<width)
            return formatWidth('0'+str, width)
        else
            return str
    }

    function timeFormat(inTime, formatStr, getDate){
        formatStr = formatStr || 'Y-M-D H:m:S'
        let weeks = ['日','一','二','三','四','五','六']
        let formater = {
            Y: inTime.getFullYear(),
            M: formatWidth(inTime.getMonth()+1,2),
            D: formatWidth(inTime.getDate(),2),
            H: formatWidth(inTime.getHours(),2),
            m: formatWidth(inTime.getMinutes(),2),
            S: formatWidth(inTime.getSeconds(),2),
            W: '星期'+weeks[inTime.getDay()]
        }
        for(let i in formater)
            formatStr = formatStr.replace(i, formater[i])
        return getDate ? new Date(formatStr) : formatStr
    }

    function addlist(n, $input_node) {
        $input_node.after('<div id="alert' + n.toString() + '"><ul id="alertUl' + n.toString() + '"></ul></div>');
        var $alert = $("#alert" + n.toString());
        var $alertUl = $("#alertUl" + n.toString());

        $input_node.bind("keyup", function () {
            if (" " == $(this).val()) {

                // 清空列表
                // clearUl();

                // 获取到用户所输入的内容
                var value = $(this).val();
                // console.log(value);

                var data = [
                    '尼群地平片 1 10mg',
                    '复方丹参片 3 3片',
                    '硝苯地平片 1 10mg',
                    '氨氯地平片 1 5mg',
                    '格列吡嗪片 3 5mg',
                    '盐酸吡格列酮片 1 15mg',
                    '阿卡波糖片 3 50mg',
                    '辛伐他丁片 1 3片',
                    '格列美脲片 2 10mg',
                    '盐酸二甲双胍片 2 0.5g',
                    '阿立哌唑片 1 30mg',
                    '草酸艾司西酞普立片 1 10mg',
                    '氯氮平片 2 50mg',
                    '利培酮片 2 3mg',
                    '盐酸苯海索片 2 2mg'
                ]


                for ( var i in data) {
                    //创建一个li条目，并把它添加到对应的ul里面
                    $alertUl.append('<li id="li' + i.toString() + '" use="'+ data[i] + '">' + data[i].split(" ")[0] + '</li>');
                    var $li = $("#li" + i.toString());

                    //注册事件，内容列表鼠标移入移出,颜色变化;
                    //移入
                    $li.mouseover(function(){
                        //先存一下旧颜色
                        //$(this).attr("oldcolor",$(this).css("background-color"));
                        $(this).css("background-color","pink");
                    });
                    //移出
                    $li.mouseout(function(){
                        //$(this).css("background-color",$(this).attr("oldcolor"));
                        $(this).css("background-color","white");
                    });

                    //1.搜索框文本变成单击的元素文本;2.内容列表自动清空.
                    $li.click(function(){
                        $input_node.val($(this).attr("use").split(" ")[0]);
                        //所有的input
                        var $inputs = $('input:text');
                        //加入判断表格条件
                        //这是体检表
                        if ($input_node.selector.indexOf("jkJktjYyqks") >= 0) {
                            $($inputs[$inputs.index($input_node) + 1]).val("口服");
                            $($inputs[$inputs.index($input_node) + 2]).val("每日" + $(this).attr("use").split(" ")[1] + "次，每次" + $(this).attr("use").split(" ")[2]);
                            $($inputs[$inputs.index($input_node) + 3]).val("1年");
                        }
                        //这是高血压或糖尿病随访表
                        if ($input_node.selector.indexOf("yyqks") >= 0) {
                            $($inputs[$inputs.index($input_node) + 1]).val($(this).attr("use").split(" ")[1]);
                            $($inputs[$inputs.index($input_node) + 2]).val($(this).attr("use").split(" ")[2]);
                        }
                        $alertUl.empty();
                    });

                };

            }

        })

    }

    function tjb_event() {
        //$("#form_jktj > table > tbody > tr:nth-child(2) > td:nth-child(2) > label > input").val("20120405");
        //$("input[name='jkJktjMain.tjrq2']").val(timeFormat(new Date(), 'YMD'));
        $("input[name='jkJktjMain.tjrq2']").val("20210118");
        //获得体检表人群类型
        let renqun = $("#penple").text().slice($("#penple").text().indexOf(":")+1);
        $("input[name='jkJktjMain.zz4'][value='1']").click();
        $("#_easyui_textbox_input8").blur(function() {
            $("#_easyui_textbox_input44").attr("class", "textbox-text validatebox-text");
            $("#_easyui_textbox_input44").val($("#_easyui_textbox_input8").val());
            $("input[name='jkJktjCt.xl69']").attr("value", $("#_easyui_textbox_input8").val());
        });
        $("input[name='jkJktjShfs.dlpl23'][value='4']").click();
        $("input[name='jkJktjShfs.ysxg27'][value='1']").click();
        $("input[name='jkJktjShfs.xyzk28'][value='1']").click();
        $("input[name='jkJktjShfs.yjpl32'][value='1']").click();
        $("input[name='jkJktjShfs.jcsyw40'][value='1']").click();
        $("input[name='jkJktjZqgn.kc47'][value='1']").click();
        $("input[name='jkJktjZqgn.cl48'][value='1']").click();
        $("input[name='jkJktjZqgn.yb49'][value='1']").click();
        $("#_easyui_textbox_input40").attr("class", "textbox-text validatebox-text");
        $("#_easyui_textbox_input40").val("5.2");
        $("#_easyui_textbox_input41").attr("class", "textbox-text validatebox-text");
        $("#_easyui_textbox_input41").val("5.2");
        $("input[name='jkJktjZqgn.zysl50']").val("5.2");
        $("input[name='jkJktjZqgn.yysl51']").val("5.2");
        //$("input[name='jkJktjZqgn.zysl50']").attr("value", "5.2");
        //$("input[name='jkJktjZqgn.yysl51']").attr("value", "5.2");
        $("input[name='jkJktjZqgn.tl54'][value='1']").click();
        $("input[name='jkJktjZqgn.ydgn55'][value='1']").click();
        $("input[name='jkJktjCt.pf58'][value='1']").click();
        $("input[name='jkJktjCt.gm60'][value='1']").click();
        $("input[name='jkJktjCt.lbj62'][value='1']").click();
        $("input[name='jkJktjCt.tzx64'][value='1']").click();
        $("input[name='jkJktjCt.hxy65'][value='1']").click();
        $("input[name='jkJktjCt.ly67'][value='1']").click();
        $("input[name='jkJktjCt.xlq70'][value='1']").click();
        $("input[name='jkJktjCt.zy71'][value='1']").click();
        $("input[name='jkJktjCt.fb73Yt'][value='1']").click();
        $("input[name='jkJktjCt.fb73Gd'][value='1']").click();
        $("input[name='jkJktjCt.fb73Ydxzy'][value='1']").click();
        $("input[name='jkJktjCt.fb73Bk'][value='1']").click();
        $("input[name='jkJktjCt.fb73Pd'][value='1']").click();
        $("input[name='jkJktjCt.xzsz74'][value='1']").click();
        $("input[name='jkJktjJkwt.nxgjb126'][value='1']").click();
        $("input[name='jkJktjJkwt.szjb128'][value='1']").click();
        $("input[name='jkJktjJkwt.xzjb130'][value='1']").click();
        $("input[name='jkJktjJkwt.xgjb132'][value='1']").click();
        $("input[name='jkJktjJkwt.ybjb134'][value='1']").click();
        $("input[name='jkJktjJkwt.sjxtjb136'][value='1']").click();
        if ((renqun.indexOf("糖尿病") >= 0) | (renqun.indexOf("精神病") >= 0) | (renqun.indexOf("高血压") >= 0) | (renqun.indexOf("肺结核") >= 0)) {
            $("input[name='jkJktjJkwt.qtxtjb138'][value='2']").click();
            $("input[name='jkJktjJkwt.qtxtjby139']").val(renqun);
            $("input[name='jkJktjJkzd.ykzd161'][value='1']").click();
        }
        else{
            $("input[name='jkJktjJkwt.qtxtjb138'][value='1']").click();
        }
        $("input[name='jkJktjJkzd.tjyc159'][value='1']").click();
        //$("input[name='jkJktjJkzd.ykzd161Qt']").val("加强锻炼");
        //$("input[name='jkJktjJkzd.wxyskz162'][value='3']").click();
        $("input[name='jkJktjJkzd.wxyskz162'][value='4']").click();

        //给用药情况加可选择列表
        for (var i in [0,1,2,3,4,5]) {
            addlist(i,$("input[name='jkJktjYyqks[" + i.toString() + "].ywmc150']"));
        }

    };

    function gxy_event() {
        //获取前一条记录序号
        let refnum = ($("#trsf > td[gxyid]").length - 1).toString();
        if (refnum != "-1") {
            $("input[name='gxyMain.sffs3'][value='2']").click();
            $("input[name='gxyMain.zz5'][value='1']").click();
            $("input[name='gxyTz.ztMqtz15']").val($("input[name='ztMqtz" + refnum + "']").val());
            $("input[name='gxyTz.ztMbtz16']").val($("input[name='ztMbtz" + refnum + "']").val());
            $("input[name='gxyTz.ztMqtz15']").focus();
            $("input[name='gxyTz.ztMbtz16']").focus();
            $("input[name='sfrq']").focus();
            $("input[name='gxyTz.tzQt20']").val($("input[name='tzQt" + refnum + "']").val());
            $("input[name='gxyShfszd.xyMqrxyl21']").val($("input[name='xyMqrxyl" + refnum + "']").val());
            $("input[name='gxyShfszd.xyMbrxyl22']").val($("input[name='xyMbrxyl" + refnum + "']").val());
            $("input[name='gxyShfszd.yjMqryjl23']").val($("input[name='yjMqryjl" + refnum + "']").val());
            $("input[name='gxyShfszd.yjMbryjl24']").val($("input[name='yjMbryjl" + refnum + "']").val());
            $("input[name='gxyShfszd.ydMqmzC25']").val($("input[name='ydMqmzC25" + refnum + "']").val());
            $("input[name='gxyShfszd.ydMqcFz26']").val($("input[name='ydMqcFz" + refnum + "']").val());
            $("input[name='gxyShfszd.ydMbmzC27']").val($("input[name='ydMbmzC27" + refnum + "']").val());
            $("input[name='gxyShfszd.ydMbcFz28']").val($("input[name='ydMbcFz" + refnum + "']").val());

            $("input[name='gxyShfszd.syqkMb29']").eq(parseInt($("input[name='syqkMb29" + refnum + "'][checked]").attr("value")) - 1).click();
            $("input[name='gxyShfszd.syqk29'][value='" + $("input[name='syqk" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='gxyShfszd.xltz30'][value='" + $("input[name='xltz" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='gxyShfszd.zyxw31'][value='" + $("input[name='zyxw" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='gxyMain.ywycx7'][value='" + $("input[name='ywycx" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='gxyMain.ywblfy8'][value='" + $("input[name='ywblfy" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='gxyMain.ccsffl9'][value='" + $("input[name='ccsffl" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name=''][value='" + $("input[name='" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name=''][value='" + $("input[name='" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name=''][value='" + $("input[name='" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name=''][value='" + $("input[name='" + refnum + "'][checked]").attr("value") + "']").click();

            $("input[name='yyqks[0].ywmc32']").val($("input[name='ywmc1_" + refnum + "']").val());
            $("td[add] input[name='yyqks[0].dw33']").val($("td[gxyid] input[name='yyqks[0].dw33']").last().val());
            $("td[add] input[name='yyqks[0].mc34']").val($("td[gxyid] input[name='yyqks[0].mc34']").last().val());
            $("input[name='yyqks[1].ywmc32']").val($("input[name='ywmc2_" + refnum + "']").val());
            $("td[add] input[name='yyqks[1].dw33']").val($("td[gxyid] input[name='yyqks[1].dw33']").last().val());
            $("td[add] input[name='yyqks[1].mc34']").val($("td[gxyid] input[name='yyqks[1].mc34']").last().val());
            $("input[name='yyqks[2].ywmc32']").val($("input[name='ywmc3_" + refnum + "']").val());
            $("td[add] input[name='yyqks[2].dw33']").val($("td[gxyid] input[name='yyqks[2].dw33']").last().val());
            $("td[add] input[name='yyqks[2].mc34']").val($("td[gxyid] input[name='yyqks[2].mc34']").last().val());
            $("input[name='yyqks[3].ywmc32']").val($("input[name='ywmc4_" + refnum + "']").val());
            $("td[add] input[name='yyqks[3].dw33']").val($("td[gxyid] input[name='yyqks[3].dw33']").last().val());
            $("td[add] input[name='yyqks[3].mc34']").val($("td[gxyid] input[name='yyqks[3].mc34']").last().val());
        } else {
            $("input[name='gxyMain.sffs3'][value='2']").click();
            $("input[name='gxyMain.zz5'][value='1']").click();
            $("input[name='gxyTz.tzQt20']").val("无");
            $("input[name='gxyShfszd.xyMqrxyl21']").val("0");
            $("input[name='gxyShfszd.xyMbrxyl22']").val("0");
            $("input[name='gxyShfszd.yjMqryjl23']").val("0");
            $("input[name='gxyShfszd.yjMbryjl24']").val("0");
            $("input[name='gxyShfszd.ydMqmzC25']").val("0");
            $("input[name='gxyShfszd.ydMqcFz26']").val("0");
            $("input[name='gxyShfszd.ydMbmzC27']").val("6");
            $("input[name='gxyShfszd.ydMbcFz28']").val("30");

            $("input[name='gxyShfszd.syqkMb29']").eq(0).click();
            $("input[name='gxyShfszd.syqk29'][value='2']").click();
            $("input[name='gxyShfszd.xltz30'][value='2']").click();
            $("input[name='gxyShfszd.zyxw31'][value='2']").click();
            $("input[name='gxyMain.ywycx7'][value='1']").click();
            $("input[name='gxyMain.ywblfy8'][value='0']").click();
            $("input[name='gxyMain.ccsffl9'][value='1']").click();

            //给用药情况加可选择列表
            for (var i in [0,1,2]) {
                addlist(i,$("input[name='yyqks[" + i.toString() + "].ywmc32']"));
            }
        }
    }

    function tnb_event() {
        //获取前一条记录序号
        let refnum = ($("#trsf > td[tnbid]").length - 1).toString();
        if (refnum != "-1") {
            $("input[name='tnbMain.sffs4'][value='2']").click();
            $("input[name='tnbMain.zz5'][value='1']").click();
            $("input[name='tnbTz.mqtz21']").val($("input[name='tnbTz.mqtz21" + refnum + "']").val());
            $("input[name='tnbTz.mbtz22']").val($("input[name='tnbTz.mbtz22" + refnum + "']").val());
            $("input[name='tnbTz.mqtz21']").focus();
            $("input[name='tnbTz.mbtz22']").focus();
            $("input[name='sfrq']").focus();

            $("input[name='tnbTz.zbdmbd25'][value='" + $("input[name='zbdmbd" + refnum + "'][checked]").attr("value") + "']").click();
            $("td[add] input[name='tnbTz.qt26']").val($("td[tnbid] input[name='tnbTz.qt26']").last().val());

            $("input[name='tnbShfszd.mqrxyl27']").val($("input[name='xyMqrxyl" + refnum + "']").val());
            $("input[name='tnbShfszd.mbrxyl28']").val($("input[name='xyMbrxyl" + refnum + "']").val());
            $("input[name='tnbShfszd.mqryjl29']").val($("input[name='tnbMqryjl" + refnum + "']").val());
            $("input[name='tnbShfszd.mbryjl30']").val($("input[name='tnbMbryjl" + refnum + "']").val());
            $("td[add] input[name='tnbShfszd.ydMqmzC40']").val($("td[tnbid] input[name='tnbShfszd.ydMqmzC40']").last().val());
            $("td[add] input[name='tnbShfszd.ydMqcFz41']").val($("td[tnbid] input[name='tnbShfszd.ydMqcFz41']").last().val());
            $("td[add] input[name='tnbShfszd.ydMbmzC42']").val($("td[tnbid] input[name='tnbShfszd.ydMbmzC42']").last().val());
            $("td[add] input[name='tnbShfszd.ydMbcFz43']").val($("td[tnbid] input[name='tnbShfszd.ydMbcFz43']").last().val());
            $("td[add] input[name='tnbShfszd.mqzs32']").val($("td[tnbid] input[name='tnbShfszd.mqzs32']").last().val());
            $("td[add] input[name='tnbShfszd.mbzs33']").val($("td[tnbid] input[name='tnbShfszd.mbzs33']").last().val());

            $("input[name='tnbShfszd.xltz34'][value='" + $("input[name='xltz" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='tnbShfszd.zyxw35'][value='" + $("input[name='zyxw" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='tnbMain.ywycx9'][value='" + $("input[name='ywycx9" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='tnbMain.ywblfy10'][value='" + $("input[name='ywblfy10" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='tnbMain.dxtfy11'][value='" + $("input[name='dxtfy11" + refnum + "'][checked]").attr("value") + "']").click();
            $("input[name='tnbMain.ccsffl12'][value='" + $("input[name='ccsffl12" + refnum + "'][checked]").attr("value") + "']").click();

            $("td[add] input[name='yyqks[0].ywmc36']").val($("td[tnbid] input[name='yyqks[0].ywmc36']").last().val());
            $("td[add] input[name='yyqks[0].mr37']").val($("td[tnbid] input[name='yyqks[0].mr37']").last().val());
            $("td[add] input[name='yyqks[0].mc38']").val($("td[tnbid] input[name='yyqks[0].mc38']").last().val());
            $("td[add] input[name='yyqks[1].ywmc36']").val($("td[tnbid] input[name='yyqks[1].ywmc36']").last().val());
            $("td[add] input[name='yyqks[1].mr37']").val($("td[tnbid] input[name='yyqks[1].mr37']").last().val());
            $("td[add] input[name='yyqks[1].mc38']").val($("td[tnbid] input[name='yyqks[1].mc38']").last().val());
            $("td[add] input[name='yyqks[2].ywmc36']").val($("td[tnbid] input[name='yyqks[2].ywmc36']").last().val());
            $("td[add] input[name='yyqks[2].mr37']").val($("td[tnbid] input[name='yyqks[2].mr37']").last().val());
            $("td[add] input[name='yyqks[2].mc38']").val($("td[tnbid] input[name='yyqks[2].mc38']").last().val());
            $("td[add] input[name='tnbMain.ydszl13']").val($("td[tnbid] input[name='tnbMain.ydszl13']").last().val());
            $("td[add] input[name='tnbMain.ydsyfyl14']").val($("td[tnbid] input[name='tnbMain.ydsyfyl14']").last().val());
        } else {
            $("input[name='tnbMain.sffs4'][value='2']").click();
            $("input[name='tnbMain.zz5'][value='1']").click();

            $("input[name='tnbTz.zbdmbd25'][value='1']").click();
            $("td[add] input[name='tnbTz.qt26']").val("无");

            $("input[name='tnbShfszd.mqrxyl27']").val("0");
            $("input[name='tnbShfszd.mbrxyl28']").val("0");
            $("input[name='tnbShfszd.mqryjl29']").val("0");
            $("input[name='tnbShfszd.mbryjl30']").val("0");
            $("td[add] input[name='tnbShfszd.ydMqmzC40']").val("0");
            $("td[add] input[name='tnbShfszd.ydMqcFz41']").val("0");
            $("td[add] input[name='tnbShfszd.ydMbmzC42']").val("6");
            $("td[add] input[name='tnbShfszd.ydMbcFz43']").val("30");
            $("td[add] input[name='tnbShfszd.mqzs32']").val("300");
            $("td[add] input[name='tnbShfszd.mbzs33']").val("300");

            $("input[name='tnbShfszd.xltz34'][value='2']").click();
            $("input[name='tnbShfszd.zyxw35'][value='2']").click();
            $("input[name='tnbMain.ywycx9'][value='1']").click();
            $("input[name='tnbMain.ywblfy10'][value='0']").click();
            $("input[name='tnbMain.dxtfy11'][value='1']").click();
            $("input[name='tnbMain.ccsffl12'][value='1']").click();

            //给用药情况加可选择列表
            for (var i in [0,1,2]) {
                addlist(i,$("input[name='yyqks[" + i.toString() + "].ywmc36']"));
            }
        }

    }

    //html加载完成
    $(document).ready(function(){
        //打开了个人健康档案页面
        if (document.title == "居民健康档案") {

            //方法一：给建立表格最终按钮增加监听，行不通
            //             if($("#dlg-buttons1 > a").length == 1) {
            //                 alert($("#dlg-buttons1 > a").attr("onclick"));
            //                 var test;
            //                 $("#dlg-buttons1 > a").bind("onclick", test = function() {
            //                     if($("#form_jktj").length == 1) {
            //                         alert("111");
            //                         //加入按钮
            //                         let btn = '<a>输入默认值</a>';
            //                         $("#form_jktj > table > tbody > tr:nth-child(1)").append(btn);
            //                     }
            //                 });
            //             }

            //方法二：监听整个页面的click事件，添加按钮后解绑
            $(document).click(function(){
                //打开的是健康体检表，健康体检才有此id的表格
                if(($("#form_jktj").length == 1) && ($("#btn > span > span.l-btn-text").length == 0)){
                    //还没添加按钮
                    if($("#record").length == 0) {
                        //加入按钮
                        //let btn = '<td colspan="3" style="border:none;font-weight:bold"><a id="record">输入默认值</a></td>';
                        //$("#form_jktj > table > tbody > tr:nth-child(1) > td:nth-child(1)").after(btn);
                        //a不能用button代替，原因不明
                        let btn = '<h3><a id="record">输入默认值</a></h3>';
                        $("#penple").after(btn);
                        $("#record").css('color','yellow');
                        $("#record").css('background-color','green');
                        $("#record").click(tjb_event);
                        //解绑事件
                        //$(document).unbind("click");
                    }
                };

                //打开的是高血压随访表
                if(($("#da_center > div > h2").text() == "高血压患者随访服务记录表") && ($("td[add]").length != 0)) {
                    //还没添加按钮
                    if($("#record").length == 0) {
                        //加入按钮
                        //let btn = '<td colspan="3" style="border:none;font-weight:bold"><a id="record">输入默认值</a></td>';
                        //$("#form_jktj > table > tbody > tr:nth-child(1) > td:nth-child(1)").after(btn);
                        //a不能用button代替，原因不明
                        let btn = '<h3><a id="record">输入默认值</a></h3>';
                        $("#da_center > div > h2").after(btn);
                        $("#record").css('color','yellow');
                        $("#record").css('background-color','green');
                        $("#record").click(gxy_event);
                        //解绑事件
                        //$(document).unbind("click");
                    }
                }

                //打开的是糖尿病随访表
                if(($("#da_center > div.jk_table > h2").text() == "2型糖尿病患者随访服务记录表") && ($("td[add]").length != 0)) {
                    //还没添加按钮
                    if($("#record").length == 0) {
                        //加入按钮
                        //let btn = '<td colspan="3" style="border:none;font-weight:bold"><a id="record">输入默认值</a></td>';
                        //$("#form_jktj > table > tbody > tr:nth-child(1) > td:nth-child(1)").after(btn);
                        //a不能用button代替，原因不明
                        let btn = '<h3><a id="record">输入默认值</a></h3>';
                        $("#da_center > div.jk_table > h2").after(btn);
                        $("#record").css('color','yellow');
                        $("#record").css('background-color','green');
                        $("#record").click(tnb_event);
                        //解绑事件
                        //$(document).unbind("click");
                    }
                }

            });


            //             //方法三：监听中央区域变化，为啥是多次变化，行不通
            //             $("#da_center").bind('DOMNodeInserted', function(e) {
            //                 //页面出现了健康体检表
            //                 if($("#form_jktj").length == 1) {
            //                     //加入按钮
            //                     let btn = '<a>输入默认值</a>';

            //                     $("#form_jktj > table > tbody > tr:nth-child(1)").append(btn);
            //                 };
            //             });

            //             //方法四：ajaxComplete监听，无反应
        }
    });
})();
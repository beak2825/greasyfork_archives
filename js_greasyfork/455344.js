// ==UserScript==
// @name         WQHelper
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  come as you are
// @author       PeerLessSoul
// @match        http://yngy.net.cn:8080/spa/workflow/static4form/index.html?_rdm=*
// @match        http://yngy.net.cn:8080/spa/cube/index.jsp?*
// @icon         none
// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455344/WQHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/455344/WQHelper.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var $ = $ || window.$;
    //不为空的判断
    function notnull(sender)
    {
        if(sender!=""&&sender!=null&&sender!=undefined)
        {
            return true;
        }
        return false;

    }

    //根据传入的字符串判断选择相应数据
    //支持 li.ant-select-dropdown-menu-item.text-elli 数据集
    function sis(sender)
    {
        if(sender.includes("总公司",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
        }
        else if(sender.includes("红河",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("红河分")').click();
        }
        else if(sender.includes("金平",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("金平")').click();
        }
        else if(sender.includes("个旧",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("个旧")').click();
        }
        else if(sender.includes("屏边",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("屏边")').click();
        }
        else if(sender.includes("楚雄",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("楚雄")').click();
        }
        else if(sender.includes("金土",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("土交")').click();
        }
        else if(sender.includes("石屏",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("石屏")').click();
        }
        else if(sender.includes("金图",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("金图")').click();
        }
        else if(sender.includes("武定",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("武定")').click();
        }
        else if(sender.includes("大姚",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("大姚")').click();
        }
        else if(sender.includes("保山",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("山分公司基")').click();
        }
        else if(sender.includes("嘉勤",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("嘉勤")').click();
        }

    }


    function dokpdw(sender,detail)
    {

        if(sender.includes("红河",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("红河分"):last').click();
        }
        else if(sender.includes("金平",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("金平"):last').click();
        }
        else if(sender.includes("个旧",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("个旧"):last').click();
        }
        else if(sender.includes("屏边",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("屏边"):last').click();
        }
        else if(sender.includes("楚雄",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("楚雄"):last').click();
        }
        else if(sender.includes("房地产",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("土交"):last').click();
        }
        else if(sender.includes("石屏",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("石屏"):contains("基"):last').click();
        }
        else if(sender.includes("武定",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("武定"):last').click();
        }
        else if(sender.includes("金图",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("金图"):last').click();
        }
        else if(sender.includes("图数",0))
        {
            //$('li.ant-select-dropdown-menu-item.text-elli:contains("金图"):last').click();
        }
        else if(sender.includes("大姚",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("大姚"):last').click();
        }
        else if(sender.includes("保山",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("山分公司基"):last').click();
        }
        else if(sender.includes("设计",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("嘉勤"):last').click();
        }
        else if(sender.includes("恒丰",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("恒丰"):last').click();
        }
        else if(sender.includes("泸西",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("泸西"):last').click();
        }
        else if(sender.includes("绿春",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("绿春"):last').click();
        }
        else if(sender.includes("河口",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("河口"):last').click();
        }
        else if(sender.includes("漾濞",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("漾濞"):last').click();
        }
        else if(sender.includes("双柏",0))
        {
            $('li.ant-select-dropdown-menu-item.text-elli:contains("双柏"):last').click();
        }
        else
        {
            if(detail==false)
            {
                $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交"):last').click();
            }
            else
            {
                if(sender.includes("2923",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("2923"):last').click();
                }else if(sender.includes("5229",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("5229"):last').click();
                }
                else if(sender.includes("9001",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("9001"):last').click();
                }
                else if(sender.includes("7939",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("7939"):last').click();
                }
                else if(sender.includes("0136",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("0136"):last').click();
                }
                else if(sender.includes("6558",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("6558"):last').click();
                }
                else if(sender.includes("1687",0))
                {
                    $('li.ant-select-dropdown-menu-item.text-elli:contains("1687"):last').click();
                }


            }
        }




    }


    let optype=-1;
    //待办事项-optype=1 baseurl:（/spa/workflow/）
    //包含费用报销申请单、借款申请单、开票申请单
    //票款信息维护--optype=2 baseurl:（/spa/cube/）
    if(location.href.includes("/spa/workflow/",0))
    {
        optype=1;
    }
    else if(location.href.includes("/spa/cube/",0))
    {
        optype=2;
    }
    //alert(optype);

    if(optype==1)
    {
        //待办事项--包含借支、报销、开收据
        var checkcell=setInterval(()=>{
            let BLLType =$("td.mainTd_1_1.etype_1.td_textalign_center").text().replace(/\s+/g,'');
            if(BLLType=="费用报销申请单")
            {
                //2022年11月16日OK
                let PXType =$($("td.mainTd_13_2.etype_3.td_textalign_left")[0]).text();
                if(notnull(PXType))
                {
                    //let readysetted=$($("div.ant-select-selection-selected-value")[1]).text();
                    //if(notnull(readysetted))
                    //{
                          //$("div.ant-select-selection.ant-select-selection--single")[1].click();
                        //clearInterval(checkcell);
                        //return;
                    //}

                    //刷新选择数据
                    $("div.ant-select-selection.ant-select-selection--single")[1].click();
                    //备选数据集 $("li.ant-select-dropdown-menu-item.text-elli")
                    //<(.*?)> 替换 为空格
                    if(PXType =="垫付报销")
                    {
                        //$("li.ant-select-dropdown-menu-item.text-elli")[2].click();
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("2923"):last').click();
                    }
                    if(PXType =="借支报销")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("现"):last').click();
                    }
                    if(PXType =="油卡报销")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("加油卡"):last').click();
                    }
                    if(PXType =="ETC报销")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("2923"):last').click();
                    }

                    if(PXType =="报销支付")
                    {
                        //看第一个人
                        //let FPText =$($("div.wf-req-sign-list")[0].children[0].children[1].children[0]).text();
                        //if(notnull(FPText))
                        //{
                            //sis(FPText);
                        //}
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交行"):last').click();

                    }

                    if(PXType =="其它")
                    {
                        //看摘要
                        //let zytext =$("#field6239span").text();
                        //sis(zytext);


                    }
                     if(PXType =="合同付款")
                    {


                    }
                    if(PXType =="代付款项")
                    {

                    }
                    clearInterval(checkcell);
                }

            }else if(BLLType=="借款申请单")
            {
                //2022-12-5 修订
                let JKType =$($("span.child-item.wdb")[2]).text();
                let readysetted=$($("div.ant-select-selection-selected-value")[0]).text();
                if(notnull(readysetted))
                {
                    clearInterval(checkcell);
                    return;
                }

                if(notnull(JKType))
                {

                    $("div.ant-select-selection.ant-select-selection--single")[0].click();

                    if(JKType=="加油卡充值")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("油卡")').click();
                    }
                    else if(JKType=="项目评审费")
                    {
                        let hsjg =$($("span.child-item.wdb")[0]).text();
                        if(hsjg.includes("总",0))
                        {
                            $('li.ant-select-dropdown-menu-item.text-elli:contains("现金")').click();
                        }
                        else
                        {
                            $('li.ant-select-dropdown-menu-item.text-elli:contains("2923")').click();
                        }
                    }
                    else if(JKType=="预付工程款")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="投标保证金")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="预付采购款")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="履约保证金")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="定点消费押金")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="培训会费")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="体外税费")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("2923")').click();
                    }
                    else if(JKType=="市场业务费")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("2923")').click();
                    }
                    else if(JKType=="项目实施费")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("2923")').click();
                    }
                    else if(JKType=="管理预付费")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="工程进度款")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="ETC卡充值")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("2923")').click();

                    }
                    else if(JKType=="因私借款")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="其它借款")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }
                    else if(JKType=="业务")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("现金")').click();
                    }
                    else if(JKType=="项目")
                    {
                        $('li.ant-select-dropdown-menu-item.text-elli:contains("阳交")').click();
                    }

                    clearInterval(checkcell);
                    return;
                }

            }else if(BLLType=="开票申请单")
            {
                if($("div.ant-select-selection.ant-select-selection--single")[0]!=null)
                {
                    //$("div.ant-select-selection.ant-select-selection--single")[0].click();
                    //$("li.ant-select-dropdown-menu-item.text-elli")[1].click();

                    //添加按钮
                    let newDiv = document.createElement("a");
                    newDiv.href = "";
                    newDiv.text = "★";
                    newDiv.style="font-size: 20px;"
                    newDiv.onclick = copytokp;
                    $("div.detailButtonDiv").append(newDiv);
                    clearInterval(checkcell);
                }
            }else
            {
                BLLType=$("td.mainTd_0_1.etype_1.td_textalign_center").text();
                if(notnull(BLLType))
                {
                    if(BLLType=="资金流转申请单")
                    {
                        if (window.top == window.self)
                        {
                            //查看科目
                            let subbll= $("#weaSelect_2 > div > div > div").text();
                            if(notnull(subbll))
                            {
                                if(subbll=="提出备用金")
                                {
                                    $("div.ant-select-selection.ant-select-selection--single")[2].click();
                                    $("li.ant-select-dropdown-menu-item.text-elli")[2].click();
                                    $("#field9154").val($("#field9171")[0].value);
                                    $("#field9152").val($($("span.text")[0]).text());
                                    clearInterval(checkcell);
                                }else if(subbll=="资金申请")
                                {
                                    $("div.ant-select-selection.ant-select-selection--single")[2].click()
                                    let lzsy= $("#field9173").text();
                                    if(lzsy!=="")
                                    {
                                        dokpdw(lzsy,true);
                                    }
                                    else
                                    {
                                        //$('li.ant-select-dropdown-menu-item.text-elli:contains(""):last').click();
                                        //不选任何
                                        $('li.ant-select-dropdown-menu-item.text-elli')[0].click();
                                    }

                                    $("#field9154").val($("#field9171")[0].value);
                                    $("#field9152").val($($("span.text")[0]).text());
                                    clearInterval(checkcell);
                                }
                                else if(subbll=="资金归集")
                                {
                                    $("div.ant-select-selection.ant-select-selection--single")[2].click()
                                    let lzsy= $("#field9173").text();
                                    dokpdw(lzsy,false);
                                    //$('li.ant-select-dropdown-menu-item.text-elli:contains("恒丰"):last').click();
                                    $("#field9154").val($("#field9171")[0].value);
                                    $("#field9152").val($($("span.text")[0]).text());
                                    clearInterval(checkcell);
                                }
                            }
                        }
                        else
                        {
                            clearInterval(checkcell);
                        }

                    }
                    else
                    {
                        clearInterval(checkcell);
                    }
                }



            }


        },1000);
    }
    else if(optype==2)
    {
        //票款信息维护
        //2020-11-16 OK
        var checkpk =setInterval(()=>{
            if(notnull($("#copybutton1")[0].title))
            {
                if($("#copybutton1")!=null)
                {
                    let newDiv = document.createElement("a");
                    newDiv.href = "#";
                    newDiv.text = " ★";
                    newDiv.style="font-size: 20px;"
                    newDiv.onclick = copyto;
                    $("#copybutton1").after(newDiv);
                    clearInterval(checkpk);
                }
            }
        },1000);

    };

    //待办事项-开票申请
    function copytokp()
    {

        if($("input.wf-input.wf-input-3.wf-input-detail.wf-input-field10161").length==0)
        {
            alert("先点左边新增按钮后再复制！");
            return false;
        }

        //到账日期
        $("#field10159_0").val($($("span.text")[0]).text());
        //刷新下拉列表
        $($("div.ant-select-selection.ant-select-selection--single")[0]).click();
        $($("div.ant-select-selection.ant-select-selection--single")[1]).click();
        $($("div.ant-select-selection.ant-select-selection--single")[2]).click();


        let htbh= $("#field6517span>a").text();
        if(htbh=="QTHT-1912-01")
        {
            //出票单位
            $($("li.ant-select-dropdown-menu-item.text-elli:contains('阳科'):first")).click();
            $($("li.ant-select-dropdown-menu-item.text-elli:contains('2923'):last")).click();

        }else if(htbh=="QTHT-1911-01")
        {
            //出票单位
            let cpdw =$("span.child-item.wdb:last").text();
            //出票单位
            $($("li.ant-select-dropdown-menu-item.text-elli:contains('"+cpdw+"'):first")).click();
            $($("li.ant-select-dropdown-menu-item.text-elli:contains('9001'):last")).click();
        }
        else if(htbh=="QTHT-1501-01")
        {
            //let cpdw=$("#weareqtop_nn6dha_1668837633425 > div.wea-new-top-req-content > div.wf-req-form-content > div > div > div.wf-req-form-wrapper > div.wf-req-form > div > table > tbody > tr:nth-child(9) > td.mainTd_8_2.etype_3.td_textalign_left > div > span > span.child-item.wdb").text();
            let cpdw =$("span.child-item.wdb:last").text();
            //出票单位
            $($("li.ant-select-dropdown-menu-item.text-elli:contains('"+cpdw+"'):first")).click();
            //检索摘要
            let zaiyao =$("#field6510span").text();
            if(!zaiyao.includes("卡",0))
            {
                $("#field8838").val("详见银行回执");
            }
            dokpdw(zaiyao,true);

        }else
        {
            alert("合同编号:"+htbh+"暂不支持！");
        }
        //到账金额
        let cpje=$("input.wf-input.wf-input-3.wf-input-main.wf-input-field6592")[0].value;
        $("input.wf-input.wf-input-3.wf-input-detail.wf-input-field10161")[0].focus();
        $("input.wf-input.wf-input-3.wf-input-detail.wf-input-field10161")[0].value=cpje;
        $("input.wf-input.wf-input-3.wf-input-detail.wf-input-field10161")[0].blur();

        return false;
    }



    //票款维护
    function copyto()
    {
        if($("input.wf-input.wf-input-3.wf-input-detail.wf-input-fieldfield8843_0").length==0)
        {
            alert("先点左边新增按钮后再复制！");
            return false;
        }
        //出票单位
        let cpdw=$($("div.ant-select-selection-selected-value")[2]).text();
        let cpje =$("input.wf-input.wf-input-3.wf-input-main.wf-input-fieldfield6605")[0].value;
        //复制
        $("input.wf-input.wf-input-3.wf-input-detail.wf-input-fieldfield8843_0")[0].focus();
        $("input.wf-input.wf-input-3.wf-input-detail.wf-input-fieldfield8843_0")[0].value=cpje;
        //刷新选择缓存
        $("div.ant-select-selection.ant-select-selection--single").click();
        $("div.ant-select-selection.ant-select-selection--single").click();
        dokpdw(cpdw,false);
        return false;
    }




})();
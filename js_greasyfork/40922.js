// ==UserScript==
// @name         self test code
// @namespace    http://mytesttampermonkey.net/
// @version      0.808
// @description  self test code dont download
// @match        *://issue.cpic.com.cn/*
// @match        *://dwx.cpic.com.cn/*
// @author       mmyy
// @require https://unpkg.com/underscore@1.13.7/underscore-umd-min.js
// require https://greasyfork.org/scripts/375973-userinfo2/code/userInfo2.js?version=716146
// require https://greasyfork.org/scripts/375970-userinfo/code/userInfo.js?version=716150
// require https://greasyfork.org/scripts/375974-userinfo3/code/userInfo3.js?version=716136
// require https://greasyfork.org/scripts/375975-userinfo4/code/userInfo4.js?version=716144
// require https://greasyfork.org/scripts/387352-userinfo5/code/userInfo5.js?version=716151
// @require https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/jquery-ui.min.js
// @resource https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/themes/excite-bike/jquery-ui.css
// @require https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @grant GM_download
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40922/self%20test%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/40922/self%20test%20code.meta.js
// ==/UserScript==
var zhuanpiao = ['禹州神安', '信阳畅达', '平顶山浩源', '内乡栩源', '禹州驰程', '许昌华菱', '平顶山益帆', '内乡鹏达', '安阳喜顺', '郑州万法运输', '唐河县宏旭物流'];
(function () {
    'use strict';

    var localHref = window.location.href;

  Object.defineProperty(document, 'cookie', {
        get: function() {
            //console.log('getcookie');
            return "";
        },
        set: function(value) {
            //console.log('setcookie', value);
            return value;
        },
    });
    //不是投保信息页签返回
    var pageType = 0;
    if (localHref.indexOf("quick_quotation") > -1) {
        pageType = 1;
    } else if (localHref.indexOf("premium_payment") > -1) {
        pageType = 6; //支付页面
    } else if (localHref.indexOf("quotation_search") > -1) {
        pageType = 4;//报价查询
    } else if (localHref.indexOf("quotationPreview") > -1) {
        pageType = 7; //预览页面
    } else if (localHref.indexOf("login") > -1) {
        pageType = 5;//登录
        var loginInfo =[{userId:'w_sjtcwb5',pwd:'Cpic+2023',sc:'sjtcwb5'}
                       ,{userId:'w_zzhyqc3',pwd:'Wwcd@16888',sc:'zzhyqc3'}];
        var accountHtml = $("<span style='display:block;margin-top: 5px;'></span>");
        function getBase64ImageUrl(url,callBack,imgType){
          if(!imgType){
            imgType="image/png";
          }
          var xhr = new XMLHttpRequest();
          xhr.responseType="arraybuffer";
          xhr.open('GET', url, true);
          xhr.onload=function(){
            var result=xhr.response;
            var file = new File([result], "foo."+imgType.match(/\/([A-Za-z]+)/)[1], {
              type: imgType,
            });
            var reader = new FileReader();
            reader.onload = function(evt) {
              callBack(evt.target.result);
            };
            reader.readAsDataURL(file)
          }
          xhr.send(null);
        }

        var i = 0;
        var cnt = loginInfo.length;
        var accountSpan = '';
       for(var t =0;t<cnt;t++){
           accountSpan +="<span index='"+t+"'>"+loginInfo[t].sc+"</span>";
       }
       $(accountHtml).append(accountSpan);
       $(accountHtml).on('click','span',function(){
           var curIndex = $(this).attr("index");
           var curAccount =  loginInfo[curIndex];
           $("#j_username").val(curAccount.userId).blur();
           $("#_password").val(curAccount.pwd).blur();

           $("#j_login").removeClass("not-allowed");
       		 $("#j_login").removeAttr("disabled");
       		 $(".verifyCodeGroup").removeClass("hidden");
       		 $("#verifyCode").val("").focus();

       		 //$("#capImg").attr("src","../../../../auth/getCaptchaImage?"+Math.random());
           $('.dragProgress').css("width",'258px');
           $('.dragBtn').css("left",'258px');

           getBase64ImageUrl('https://issue.cpic.com.cn/ecar/auth/getCaptchaImage?'+Math.random(),function(d){
             console.log(d);
              $("#capImg").attr("src",d);
            }

           );

      });
      $("form").prepend($(accountHtml));
      $("form").find(".blank-20").css("cssText",
              'height:8px !important;'
       );
       $(accountHtml).find("span").css("cssText",
              'padding: 0 5px;border: 1px solid #c5c5c5;height: 32px;line-height: 32px;display: inline-block;cursor: pointer;margin:0 3px;'
       );
      $(accountHtml).find("span").mouseenter(function(){$(this).css('background','#eaeaea');}).mouseout(function(){$(this).css('background','white');});
         $(".login-users i").click(function(){
            var curAccount = loginInfo[i%cnt];
            $("#j_username").val(curAccount.userId);
            $("#_password").val(curAccount.pwd);

            $("#j_login").removeClass("not-allowed");
       		  $("#j_login").removeAttr("disabled");
       		  $(".verifyCodeGroup").removeClass("hidden");
       		  $("#verifyCode").val("");
       		  //$("#capImg").attr("src","../../../../auth/getCaptchaImage?"+Math.random());

            $('.dragProgress').css("width",'258px');
            $('.dragBtn').css("left",'258px');

            i++;
        })

    }
    else     if (location.hostname.includes("dwx.cpic.com.cn")) {
        console.log("在 dwx 页面运行（包括 iframe 内加载时）");
        // 这里写针对 dwx 页面逻辑

        pageType = 8; //非车页面
    }
  if(pageType == 8){
    // 监听整个 body 的 DOM 变化
    const observer = new MutationObserver(() => {
        const input = document.querySelector('input[placeholder="用于给您发送电子保单"]');

        if (input) {
            console.log("找到目标 input:", input);

            // 设置值
            input.value = "3302377161@qq.com";

            // 触发 input 事件，通知 React/AntD
            input.dispatchEvent(new Event("input", { bubbles: true }));

            // 改样式
            //input.style.color = "red";

            //alert("已填充 123");

            // 找到后就不再监听
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
    if (pageType == 4) {
        //单击复制功能begin
        $("#quotationSearchTable").append("<input type='text' style='display:block;position: absolute;left: -900px;' value='' id='copyStr' />");

        var oldCreateTable = unsafeWindow.createTable;
        var createTable = function (data, element, otr, inputType, tabletStateData) {
            oldCreateTable(data, element, otr, inputType, tabletStateData);
            //向 单元格 添加复制事件
            $(element).find("tbody tr").each(function (index, tr) {
                $(tr).find("td:gt(1)").click(function (e) {
                    $("#copyStr").val($.trim($(this).html())).get(0).select();
                    unsafeWindow.document.execCommand("copy");
                    var tipObj = $("<span style='font-weight: bold;z-index:999; color: green;position: absolute;border: 1px solid #0ba02b; padding: 10px 20px 10px 20px;'>复制成功</span>");
                    unsafeWindow.setTimeout(function () {
                        tipObj.remove();
                    }, 500);

                    $(tipObj).css({ "left": getX(e) - 20 + "px", "top": getY(e) - 10 + "px" });
                    $("body").append(tipObj);
                });
            });
        }
        unsafeWindow.createTable = createTable;

        var getX = function (e) {
            e = e || unsafeWindow.event;
            return e.pageX || e.clientX + unsafeWindow.document.body.scroolLeft;
        }

        var getY = function (e) {
            e = e || unsafeWindow.event;
            return e.pageY || e.clientY + unsafeWindow.document.boyd.scrollTop;
        }
        //单击复制功能end

        //获取逗号分隔的车牌号对应的 费用集合
        var iptSnArrayTag = $('<div style="float: left;margin-top: 9px; width: 562px; "><span style="float: left;width: 20px;text-align: center;">|</span><div id="computeTag" style="display:none;"><input class="tbr_table_input" value="" name="snArray" id="snArray" data="snArray" style="width: 75%;float: left;">'
        +'<a id="jfJs" class="cursor" style="width: 42px;height: 30px;line-height: 30px;text-align: center; margin-right: 12px;border: 1px solid #007aff; border-radius: 4px; color: #007aff; margin-top: 10px; margin-left: 10px; ">净费</a>'
        +'<a id="xxHd" class="cursor" style="width: 42px;height: 30px;line-height: 30px;text-align: center; margin-right: 12px;border: 1px solid #007aff; border-radius: 4px; color: #007aff; margin-top: 10px; margin-left: 10px; ">核对</a>'
        +'<a id="xzbd" class="cursor" style="width: 42px;height: 30px;line-height: 30px;text-align: center; margin-right: 12px;border: 1px solid #007aff; border-radius: 4px; color: #007aff; margin-top: 10px; margin-left: 10px; ">下载</a>'
        +'</div></div>');
        iptSnArrayTag.find("span").click(function () {
            $("#computeTag").toggle();
        });
        iptSnArrayTag.find("a").click(function () {
            var dotStr = iptSnArrayTag.find("input").val();// "123,4123,15123,512312";
            console.log(dotStr);
            var snArray = dotStr.replace(/\s/g, ",").replace('，', ',').split(',');
            let resultHtmlStr = "<table id='jszjf'><tr><td>车牌号</td><td>商</td><td>交</td><td>车船</td><td>商净费</td><td>交净费</td><td>总</td></tr>";
            let aTagId = $(this).attr("id");
            if (aTagId == "xxHd") {
                resultHtmlStr = "<table id='heduiXx'><tr><td>保单号</td><td>状态</td><td>被保险人名称</td><td>号牌号码</td><td>保费合计</td><td>录入日期</td></tr>";
            }
            _.each(snArray, function (item) {
                console.log(item);
                //根据车牌号获取 报价单号
                var settings = {
                    "async": false,
                    "dataType": "JSON",
                    "crossDomain": true,
                    "url": "http://issue.cpic.com.cn/ecar/quotationPolicy/queryQuotationPolicy",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json;charset=UTF-8"

                    },
                    "data": "{\r\n\t\"meta\": {\"pageSize\":8},\r\n\t\"redata\": {\r\n\t\t\"licensePlate\": \"" + item + "\"\r\n\t}\r\n}"
                }
                let bjdh = ""; let policyNo ="";
                $.ajax(settings).done(function (response) {
                    var result = response.result;
                    let filterArray = _.filter(result, function (item) { return item.quotationState == '5' || item.quotationState == '7' });
                    if (filterArray.length > 0) {
                        bjdh = filterArray[0].quotationNo;
                    }
                    policyNo = filterArray[0].policyNo;//保单号
                    if (bjdh) {
                        if (aTagId == "xxHd") {
                            let quotationState = filterArray[0].quotationState == 5 ? "核保通过" : filterArray[0].quotationState;
                            let insurant = filterArray[0].insurant;//被保险人
                            let licensePlate = filterArray[0].licensePlate;//车牌号
                            let totalPremium = filterArray[0].totalPremium;//保费合计
                            let recordedDate = filterArray[0].recordedDate;//录入日期

                            //3、组合复制
                            resultHtmlStr += "<tr><td>" + policyNo + "</td><td>" + quotationState + "</td><td>"
                                + insurant + "</td><td>" + licensePlate + "</td><td>" + totalPremium + "</td><td>"
                                + recordedDate + "</td></tr>";
                        } else {
                            console.log(bjdh);
                            //1、请求地址
                            settings = {
                                "async": false,
                                "dataType": "JSON",
                                "crossDomain": true,
                                "url": "http://issue.cpic.com.cn/ecar/quotationPreview/queryQuotationPreview",
                                "method": "POST",
                                "headers": {
                                    "content-type": "application/json;charset=UTF-8"

                                },
                                "data": "{\r\n\t\"meta\": {\"pageSize\":8},\r\n\t\"redata\": {\r\n\t\t\"quotationNo\": \"" + bjdh + "\"\r\n\t}\r\n}"
                            }

                            $.ajax(settings).done(function (response) {
                                let result = response.result;
                                let feeInfo = result.insuranceVo;
                                let carInfo =result.carInfoVo;

                                let cerNo = carInfo.cerNo;
                                let downUrl = 'http://issue.cpic.com.cn/ecar/epolicy/download?policyNo='+policyNo+'&cerNo='+cerNo;
                                if(aTagId == "xzbd"){

                                    GM_xmlhttpRequest({
                                    method: "GET",
                                        url: downUrl,
                                        onload: function(response) {
                                            //这里写处理函数
                                            console.log(response);
                                            GM_download(response.finalUrl,item);
                                        }
                                    });
                                }else{
                                    //2、费用信息
                                    let syxFee = feeInfo.commercialAmount;
                                    let jqxFee = feeInfo.compulsoryAmount;
                                    let ccfFee = feeInfo.payableAmount;
                                    if (!syxFee) {
                                        syxFee = 0;
                                    }
                                    if (!jqxFee) {
                                        jqxFee = 0;
                                    }
                                    if (!ccfFee) {
                                        ccfFee = 0;
                                    }
                                    //交强-交强/1.06*0.04    商业-商业/1.06*0.25
                                    let sjf = syxFee - syxFee / 1.06 * 0.25;
                                    let jjf = jqxFee - jqxFee / 1.06 * 0.04;
                                    let zjf = parseFloat(sjf) + parseFloat(jjf) + parseFloat(ccfFee);
                                    //3、组合复制
                                    resultHtmlStr += "<tr><td>" + item + "</td><td>" + syxFee + "</td><td>" + jqxFee + "</td><td>" + ccfFee + "</td><td>" + sjf + "</td><td>" + jjf + "</td><td>" + zjf + "</td></tr>";
                                }
                            });
                        }
                    }
                });

            });
            resultHtmlStr += "</table>";
            if (aTagId == "xxHd") {
                $("#heduiXx").parent().remove();
            }
            else {
                $("#jszjf").parent().remove();
            }
            let resultTableContainerTag = $('<div style="position:absolute;background:white;width:690px;top:280px;border:1px solid #cacaca;padding:5px;"><span style="float: right;width: 20px;height: 20px;">N</span>' + resultHtmlStr + '</div>');
            resultTableContainerTag.find("span").click(function () {
                $(this).parent().remove();
            });
            $("#queryCondition").after(resultTableContainerTag);
        });

        $("#queryCondition").after(iptSnArrayTag);

    }
  if(pageType == 7){
          //增加下载按钮
      $("#sideBar").append('<a id="policyDownLoad" href="javascript:;" class="icon-chat"> <img src="../img/dzbdxz.png">1 <div class="chat-tips"><img src="../img/dzbdxz_bg.png"></div> </a>');
  }
    if (pageType == 1) {


      //监听是否存在不需要弹出的框
      /***
      setInterval(function(){
          var displayCSS=$('#outCarAccidentDialog').css("display");
          if(displayCSS==='block'){
              $('#outCarAccidentDialog').hide();
          }
      },100);
***/
        var selectItem = $("<input type='button' value='选中保险项目' id='selectItem' class='btn btn-warming' style='margin-left:10px;' />");
        selectItem.click(function () {
            //设置 商业选中项
            $("#checkbox3").prop("checked", true).change();
            $("#checkbox5").prop("checked", true).change();
            $("#checkbox7").prop("checked", true).change();
            $("#checkbox8").prop("checked", true).change();
            //$("#checkbox10").prop("checked", true).change();
            $("#checkbox14").prop("checked", true).change();
            var siJi = $("#pLI");
            siJi .val(100000);
           var seatPrice = $("#seatPrice");
            seatPrice.val(100000);
        });
        $("#queryScheme").append(selectItem);

        //处理验证码 哈哈
        var newquestionDialog = unsafeWindow.questionDialog;
        if (newquestionDialog)
            console.log("存在newquestionDialog");

        var questionDialog = function (elemDialog, fn, question) {
            newquestionDialog(elemDialog, fn, question);
            var img = $("#questionAnswer").find("img");
            if (img) {
                var src = img.attr("src");
                if (src) {
                    var base64Str = src.replace("data:image/jpg;base64,", "");
                    //获取到base64,请求百度
                    GM_xmlhttpRequest({
                        method: "POST",
                        headers: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        url: "https://aip.baidubce.com/rest/2.0/ocr/v1/webimage?access_token=24.5119ae377e5b10ec5c700584c1ad291e.2592000.1670492828.282335-11171025",
                        data: "image=" + encodeURIComponent(base64Str),
                        onload: function (response) {
                            console.log(response);
                            if (response) {
                                response = $.parseJSON(response.response);
                                if (response.words_result) {
                                    var strCode = response.words_result[0].words.replace(/[^a-zA-Z0-9]/ig, "").replace("0", "O").replace("了", "3").replace("]", "J").replace("工", "I");
                                    if (strCode.length != 4) {
                                        //可以调用精确型
                                        GM_xmlhttpRequest({
                                            method: "POST",
                                            headers: {
                                                "content-type": "application/x-www-form-urlencoded"
                                            },
                                            url: "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.5119ae377e5b10ec5c700584c1ad291e.2592000.1670492828.282335-11171025",
                                            data: "image=" + encodeURIComponent(base64Str),
                                            onload: function (response) {
                                                console.log(response);
                                                if (response) {
                                                    if (response.errorCode) {
                                                        $("#questionList input").val(strCode);
                                                    } else {
                                                        response = $.parseJSON(response.response);
                                                        if (response.words_result) {
                                                            var strCode = response.words_result[0].words.replace(/[^a-zA-Z0-9]/ig, "").replace("0", "O").replace("了", "3").replace("]", "J").replace("工", "I");
                                                            $("#questionList input").val(strCode);
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else
                                        $("#questionList input").val(strCode);
                                }
                            }
                        }
                    });
                }
            }
        }
        unsafeWindow.questionDialog = questionDialog;

        var inputGetParam = $("<input type='button' style='float:left;margin-top:10px;' class='btn btn-warming' value='获取信息' id='getparam'/>");
        inputGetParam.click(function () {
            var bdSN = $("#billCode").html();
            var settings = {
                "async": true,
                "dataType": "JSON",
                "crossDomain": true,
                "url": "http://issue.cpic.com.cn/ecar/plarformQuery/queryPlatformInfo",
                "method": "POST",
                "headers": {
                    "content-type": "application/json;charset=UTF-8"

                },
                "data": "{\r\n\t\"meta\": {},\r\n\t\"redata\": {\r\n\t\t\"quotationNo\": \"" + bdSN + "\"\r\n\t}\r\n}"
            }

            $.ajax(settings).done(function (response) {
                $("#totalCompute").remove();
                var result = response.result;
                if (result) {
                    var computeDiv = "<div id='totalCompute' style=' position: absolute;top: 100px;left:10px;border: 1px solid #d6d6d6;background: white;z-index:999;padding:8px;line-height: 25px;'>";

                    if (result.platformInfoVo) {

                        if (result.platformInfoVo.lastyearStartDate) {
                            var tempobj1 = "<div style='clear: both;'>交：<span class='blue'>" + result.platformInfoVo.lastyearStartDate.split(' ')[0] + "</span>-<span class='blue'>" + result.platformInfoVo.lastyearEndDate.split(' ')[0] + "</span></div>";
                            computeDiv += tempobj1;
                        } else {
                            computeDiv += "<div style='clear: both;'>交：<span class='blue'>上年无信息</span></div>";
                        }
                        if (result.platformInfoVo.lastyearBusiStartDat) {
                            var tempobj = "<div style='clear: both;'>商：<span class='blue'>" + result.platformInfoVo.lastyearBusiStartDat.split(' ')[0] + "</span>-<span class='blue'>" + result.platformInfoVo.lastyearBusiEndDat.split(' ')[0] + "</span></div>";
                            computeDiv += tempobj;
                        } else {
                            computeDiv += "<div style='clear: both;'>商：<span class='blue'>上年无信息</span></div>";
                        }
                        if (result.claimInformationSoryVo.length > 0) {
                            var busiClaim1 = "<div>交强出险<span style='color:#ff6500;font-weight:bold;'>" + result.claimInformationSoryVo.length + "<span>次<br/><span>" + result.platformInfoVo.peccancyBusiAdjustReasonName + "</span></div>";
                            computeDiv += (busiClaim1);
                        }
                        if (result.claimInformationVo.length > 0) {
                            var busiClaim = "<div>商业出险<span style='color:#ff6500;font-weight:bold;'>" + result.claimInformationVo.length + "<span>次<br/><span>" + result.platformInfoVo.claimAdjustBusiReasonName + "</span></div>";
                            computeDiv += (busiClaim);
                        }
                        var $computeDiv = $(computeDiv);
                        $computeDiv.dblclick(function () {
                            $(this).remove();
                        });
                        $(".main").append($computeDiv);
                    }
                }
            });
        });
        //$(".title_tbxx_hjje").append(inputGetParam);
    }
    if (pageType == 1) {
        //set a text label
       /***
      var textObj = $("<input type='text' value='' placeholder='此处粘贴相关信息,顺序：姓名/身份证号/车牌号/车架号/发动机号/厂牌型号/银行类型/地址/车辆价格/公司名称' style='margin-left:15px;display:inline-block;width:80%;' class='form-control' />");
        var bigCar = $("<input type='text' value='' placeholder='身份证号' id='idCardInput' class='form-control' style='margin-left:10px;display:inline-block;width:100px;' /> ")

        textObj.on('paste', function (e) {
            var textArea = $(this);
            window.setTimeout(function () {
                var pasteData = textArea.val();
                //define that : [0] name [1] certificateCode [2] plateNo [3] vin [4] engineNo [5] brand [6] bank
                var strArray = pasteData.split("\t");
                var name = strArray[0];//姓名
                var certificateCode = strArray[1];//身份证号
                var plateNo = strArray[2];//车牌号
                var vin = strArray[3];//车架号
                var engineNo = strArray[4];//发动机号
                var brand = strArray[5];//
                var curCxData = null;// _.where(jsonData, { "vin": vin });

                if (curCxData && curCxData.length > 0) {
                    brand = curCxData[0].cx.replace(/[\u4e00-\u9fa5]+$/, "").replace("牌", "");
                    $("#modelType").val(brand);
                }
                else {
                    //可以去查詢一下
                    let left = vin.substring(0, 8);
                    let right = vin.substring(vin.length - 8, vin.length);
                    let form = new FormData();
                    form.append("leftvin", left);
                    form.append("rightvin", right);
                    form.append("x", "38");
                    form.append("y", "19");
                    GM_xmlhttpRequest({
                        method: "POST",
                        headers: {
                            "Content-Yype": "multipart/form-data",
                            "Cache-Control": "no-cache",
                            "Postman-Token": "342de4ab-96ba-41c1-8a30-be58ac8c2e79"
                        },
                        url: "http://www.chinacar.com.cn/vin_index.html",
                        data: form,
                        onload: function (response) {
                            let result = $(response.response).find('.table-list').find(".table-bg").children().first().find("a").text();
                            if (result) {
                                $("#modelType").val(result.replace(/[\u4e00-\u9fa5]+$/, "").replace("牌", ""));
                            }else{
                                $("#modelType").val(brand);
                            }
                        }
                    });
                }
                GM_setValue("bank", strArray[6]);//银行类型
                GM_setValue("address", strArray[7]);//地址
                if (strArray.length > 8) {
                    GM_setValue("money", strArray[8]);//车辆价格
                }

                console.log(strArray[7]);
                //设置对应的值
                $("#plateNo").val(plateNo);
                $("#carVIN").val(vin);
                $("#engineNo").val(engineNo);

                $("#ownerName").val(name);
                $("#certNo").val(certificateCode);

                $("#certType").val(1);//证件类型
            }, 200);
        });
        $($(".title_tbxx_bxqyr")[1]).append(textObj).append(bigCar);

      var comArray = jsonData0.concat(jsonData1).concat(jsonData2).concat(jsonData3).concat(jsonData4).concat(jsonData5).concat(jsonData6).concat(jsonData7);
        debugger;
        $('#idCardInput').autocomplete({
            minLength: 4,
            source: function (query, process) {
                var data = _.filter(comArray, function (user) { return user.身份证号.indexOf($("#idCardInput").val()) > -1; });
                if (data&&data.length>0) {

                }else{
                    data = _.filter(jsonData4, function (user) { return user.身份证号.indexOf($("#idCardInput").val()) > -1; });
                }
                var matchCount = 5;//this.options.items;//返回结果集最大数量
                return process(data);
            },
            focus: function (event, ui) {
                // $("#ml-collect-name").val(ui.item.name);
                return false;
            },
            select: function (event, ui) {
                var curJsonData = ui.item;

                var name = curJsonData.客户姓名;//姓名
                var certificateCode = curJsonData.身份证号;//身份证号
                var plateNo = curJsonData.车牌号;//车牌号
                var vin = curJsonData.车架号;//车架号
                var engineNo = curJsonData.发动机号;//发动机号
                var brand = curJsonData.车型;//厂牌型号
                var registerDate = curJsonData.登记日期;
                GM_setValue("bank", curJsonData.贷款银行);//银行类型
                GM_setValue("address", curJsonData.地址);//地址
                if (!isNaN(curJsonData.车价)) {
                    GM_setValue("money", curJsonData.车价 / 10000.0);//车辆价格
                }
                // if (name) {
                //     GM_setValue("companyName", name);//公司名称,用来判断是否要开 专票
                // }

                //设置对应的值
                $("#plateNo").val(plateNo);
                $("#carVIN").val(vin);
                $("#engineNo").val(engineNo);
                $("#modelType").val(brand);
                $("#ownerName").val(name);
                $("#certNo").val(certificateCode);
                if (registerDate) {
                    $("#stRegisterDate").val(registerDate);
                }
                $("#certType").val(1);//证件类型
                return false;
            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<a>姓名：" + item.客户姓名 + "<br>车牌号：" + item.车牌号 + "<br>身份证号：" + item.身份证号 + "</a>")
                .appendTo(ul);
        };

      // 号牌类型
    $("#plateType").on('change',function(){

      if($(this).val()=='01')
        $("#usage").find("option[value='601']").prop("selected",true);
        $("#usage").change();

        //$("select[name='ownerProp']").find("option[value='3']").prop("selected",true);
        $("select[name='certType']").find("option[value='11']").prop("selected",true);
    });   ***/
    }
    if(pageType==5){
        //登录界面

    }
    if(pageType==6){
      //支付页面
      /**
     let fetchHook={};
     let hook_fetch=unsafeWindow.cpic_ajax; //储存原始fetch
     unsafeWindow.cpic_ajax=async function(...args){ //劫持fetch

          //console.log(...args);
          if(args[0]=="你要劫持的URL"){
              return await hook_fetch(...args).then((oriRes)=>{
                  let hookRes =oriRes.clone() //克隆原始response
                  hookRes.text().then(res=>{ //读取克隆response
                      //console.log("RES",res)
                      fetchHook["劫持1"]=JSON.parse(res)
                  })
                  return oriRes //返回原始response
              })
          }
          return hook_fetch(...args)
      }
      **/
      var payItemJob = $("<input type='button' value='开始支付作业' id='payItem' class='btn btn-warming' style='margin-left:10px;' />");
      var stopPayItemJob = $("<input type='button' value='停止作业' id='stopPayItem' class='btn btn-warming' style='margin-left:10px;' />");
      var resultTipObj = $(`<div class="resultTip" style="
    position: relative;
    right: -417px;
    max-width: 228px;
    background-color: orange;
    line-height: 22px;
    padding: 5px;
  "><div class="curStatus" style="color: white;">当前无作业</div></div>`)


      var isGoOn =false;

       function doPaySelf(params,curIndex,htmlObj)
        {
          debugger;
          $(".curStatus").hide();
          $(".resultTip").append(htmlObj);
            console.log("作业正在执行，当前第 "+curIndex+" 次");
          return;
            cpic_ajax({
                url: 'paymentQuery/pay',
                data:params,
                success:function(response){
                    if(response.message.code == "success"){
                        //执行成功
                        $(htmlObj).find(".tipStatus").html("已经申请成功");
                        // 上汽流程优化 ，返回状态为1则不做处理 20181019 xiongxiujian start
                        if (response.message.status === '1') {
                            return;
                        }
                        // 上汽流程优化 ，返回状态为1则不做处理 20181019 xiongxiujian end

                        // 平台返回金额与保单金额不一致时给出提示 20191031 xiongxiujian start
                        if (response.message.status === '2') {
                            console.log(response.message.message,warningTittle);
                        }
                        if(response.result.twoDimensionCodeLink  && $.pageContext.consts.MPAY_TWO_DIMENSION == "1" && paymentType == "mpay"){
                            $("#payPrint").removeClass("bigger-dialog");
                            $("#payPrint .panel-footer .panel-bottons").removeClass("margin_top_0");
                            $('#payPrint .panel-content').addClass("panel-b").removeClass("panel-s panel-alia").append('<img class="twoDimensionCodeLink" style="width:220px;height:220px;margin:10px auto;display:block;margin-bottom:0;" src="data:image/jpeg;base64,'+response.result.twoDimensionCodeLink+'" />');
                            $('#payPrint .panel-content').append('<img class="twoDimensionCode_logo" src="../img/logo.jpg" style="position: relative;top: -121px;width: 47px;height:16px;overflow:hidden;left: 45%;border-radius: 3px;"/>')
                            $("#payPrint").addClass("pay-position");
                            payChannelObj.mpayImg = response.result.twoDimensionCodeLink;
                        }
                        payChannelObj.payNo = response.result.payNo;
                        payChannelObj.payWay = paymentType;
                        if(paymentType == 'mpay'
                            && !($.pageContext.consts["ONLY_ADD_FACEAI"] == "1" && $("#isFaceAi").prop('checked') && addEapplicationToPay.isAllIdType == 1)){
                            if( $.pageContext.consts['PAY_CHANNEL_CHOICE_CONFIG'] != '1' ){
                                payChannelObj.getCarLifeQRCode();
                            }else{
                                payChannelObj.getQRCode(2);
                            }
                        }
                    }else{
                        curIndex++;
                        $(htmlObj).find(".times").html(curIndex);
                        console.log('没有成功，继续执行');
                        if(isGoOn)
                            doPaySelf(params,curIndex);
                    }
                },
                failedFn: function ( message ) {
                    if ( message === $.trim('本次申请存在已有支付号的投保单，后台已经进行更新，请刷新后再次提交支付申请。') ) {
                        payItems = [];
                        $("[name='premiumCheckbox']").prop( 'checked', false );
                        $("#payWay").val("");
                        $("#cooperant").val("");
                    }else{
                        //出错就继续
                        curIndex++;
                        $(htmlObj).find(".times").html(curIndex);
                        console.log('没有成功，继续执行Fail');
                        if(isGoOn)
                          try{
                            doPaySelf(params,curIndex);
                          }catch(e){
                            console.log(e)
                          }

                    }
                }
            },true);
        }

       $(payItemJob).click(function(){
          /**
         * 第二版速度惊人提升
         * */
        /**
         * 第一版按照自动化界面操作 速度有点慢
         * */
        if(payItems.length==0){
          dialogs.notify('请选择需要支付的记录',notifyTittle);
          return;
        }
        var param = payItems;
        for (var i = 0; i < param.length; i++) {
            param[i].paymentType = "mpay";
            param[i].cooperant = '';
        }

	    var params = {"meta":{},"redata":{"payments":param}};
        params.redata.isPush ="";
        params.redata.payChannel = 2;
        isGoOn  = true;
        //开始支付作业
        dialogs.notify('支付作业已经在后台运行，成功后会给出提示',notifyTittle);
         //创建一个状态监听html
         let curIndex = 1;
         let statusHtml = $(`<div id="`+param[0].quotationNo+`"><span class="tipNo">`+param[0].plateNo+`</span><span class="tipStatus" style="
    margin-left: 10px;
">尝试次数<span class="times">`+curIndex+`</span>次</span></div>`);

        doPaySelf(params,curIndex,statusHtml);
      });


       //监听是否存在不需要弹出的框
      /******/
      let tipCloseJob= setInterval(function(){
          var displayCSS=$('.o-c-btn_a');
          if(displayCSS){
              displayCSS.click();
          }
      },100);

      $(stopPayItemJob).click(function(){
        $(".curStatus").hide();
         isGoOn = false;
         clearInterval (tipCloseJob);
      });
      $(".bdcx_a").append(payItemJob);
      $(".bdcx_a").append(stopPayItemJob);
      $(".bdcx_a").append(resultTipObj);

    }
    if (pageType != 1)
        return;
    var doPage3 = function (bdSN) {
        //get cookie
         $("#insuranceInfoTelephoneMust").parent().click(function(){
                var holderVo = $("#holderVo");
                holderVo.find("input[name='email']").val("3302377161@qq.com");
                holderVo.find("input[name='telephone']").val("18539459926");
         });

        var web_cookie = document.cookie;

        var settings = {
            "async": true,
            "dataType": "JSON",
            "crossDomain": true,
            "url": "https://issue.cpic.com.cn/ecar/insure/queryClauseInfo",
            "method": "POST",
            "headers": {
                "content-type": "application/json;charset=UTF-8"

            },
            "data": "{\r\n\t\"meta\": {},\r\n\t\"redata\": {\r\n\t\t\"quotationNo\": \"" + bdSN + "\"\r\n\t}\r\n}"
        }

        $.ajax(settings).done(function (response) {
            console.log("success get data ， wow ！");
            console.log(response.result);
  try{
            var holderVo = response.result.holderVo;

            var name = holderVo.name;
            var tel = holderVo.telephone;
            var idCard = holderVo.certificateCode;
            var address = holderVo.address;

            console.log("获取到投保人信息：{名称：" + holderVo.name + ",电话：" + holderVo.telephone + ",证号：" + holderVo.certificateCode);
            //被保险人 如果是 勾选了同投保人 则 单击
            // if ($("#samePolicyHolder").is(":checked")) {
            //     $("#samePolicyHolder").removeAttr("checked")
            //     $("#insureVo table").show();
            // }

            var insureVo = $("#insureVo");
            if (insureVo.find("input[name='name']").val()) {

            } else {
                insureVo.find("input[name='name']").val(name);
            }
            if (insureVo.find("input[name='certificateCode']").val()) {

            } else {
                insureVo.find("input[name='certificateCode']").val(idCard);
            }
            if (insureVo.find("input[name='telephone']").val()) {
            }
            else {
                insureVo.find("input[name='telephone']").val(tel);
            }

            console.log("已经有的地址为：" + address);
            if (insureVo.find("input[name='address']").val()) {
            }
            else {
                if (address) {

                } else {
                    var tempAddress = GM_getValue("address");
                    console.log("获取到的缓存地址为：" + tempAddress);
                    if (tempAddress)
                        address = tempAddress;
                    else
                        address = '';
                }
                console.log("最终填充地址为：" + address);
                insureVo.find("input[name='address']").val(address);
            }

            insureVo.find("select[name='relationship']").val(1);
            insureVo.find("select[name='certificateType']").val(1);
}catch{}
            var holderVo = $("#holderVo");
            var setValueObj = $("<div><input type='button' style='margin-left:15px;' class='btn btn-warming pull-right whb' value='耀泰信息' /><input type='button' style='margin-left:15px;' class='btn btn-warming pull-right dahuo' value='临时信息' /></div><input type='button' style='margin-left:15px;' class='btn btn-warming pull-right chenyi' value='晨一信息' /></div>");

            $(setValueObj).on('click', '.whb', function () {
                var holderVo = $("#holderVo");
                // holderVo.find("input[name='name']").val("李艳涛");
                // holderVo.find("input[name='certificateCode']").val("410411197708111515");
                // holderVo.find("input[name='telephone']").val("13003710000");
                // holderVo.find("input[name='address']").val("河南省平顶山市湛河区曹镇乡湾李3号");
                holderVo.find("input[name='name']").val(name);
                holderVo.find("input[name='certificateCode']").val(idCard);
                holderVo.find("input[name='telephone']").val("13003710000");
                holderVo.find("input[name='address']").val(address);
                holderVo.find("input[name='email']").val("1095860717@qq.com");
                if ($("#sendEpolicy").is(":checked")) { $("#sendEpolicy").click(); }
                if (!tel)
                    insureVo.find("input[name='telephone']").val("13003710000");
                GM_setValue("isDahuo", false);//不是大货
            });

            //处理大货车 临时
            var companyName = GM_getValue("companyName");
            if (companyName) {
                var isExistComp = _.filter(zhuanpiao, function (comp) {
                    return (comp.indexOf(companyName) > -1)
                });

                if (isExistComp && isExistComp.length > 0) {
                    $("select[name='invoiceType']").parent().next().append("<span style='color:red;'>需要开具专票,请确认</span>");
                }
            }
            $(setValueObj).on('click', '.dahuo', function () {
                var holderVo = $("#holderVo");
                holderVo.find("input[name='name']").val("况龙");
                holderVo.find("input[name='certificateCode']").val("412326198809115115");
                holderVo.find("input[name='telephone']").val("13003710000");
                holderVo.find("input[name='address']").val("河南省夏邑县韩道口镇后罗寨村况庄89号");
                holderVo.find("input[name='email']").val("192170893@qq.com");
                GM_setValue("isDahuo", 1);//是大货
                if (!tel)
                    insureVo.find("input[name='telephone']").val("13003710000");
            });
            $(setValueObj).on('click', '.chenyi', function () {
                var holderVo = $("#holderVo");
                holderVo.find("input[name='name']").val("况龙");
                holderVo.find("select[name='certificateType']").val(1);
                holderVo.find("input[name='certificateCode']").val("412326198809115115");
                holderVo.find("input[name='telephone']").val("13003710000");
                holderVo.find("input[name='address']").val("河南省夏邑县韩道口镇后罗寨村况庄89号");
                holderVo.find("input[name='email']").val("2669377897@qq.com");
                GM_setValue("isDahuo", 2);//是大货
                insureVo.find("input[name='telephone']").val("13003710000");
                $("#benificiary").val("");//移除第一受益人
            });


            //结束处理
            //holderVo.find("p:first").after(setValueObj);
            /* holderVo.find("input[name='name']").val("王浩兵");
            holderVo.find("input[name='certificateCode']").val("410426198109047012");
            holderVo.find("input[name='telephone']").val("13598869912");
            holderVo.find("input[name='address']").val("河南省平顶山市新华区中兴北路东27号院45号");
            holderVo.find("input[name='email']").val("1095860717@qq.com");
            holderVo.find("input[name='otherInfo']").val(""); */

//holderVo.find("input[name='email']").val("1095860717@qq.com");
//holderVo.find("input[name='telephone']").val("13003710000");

            if ($("#sendEpolicy").is(":checked")) { $("#sendEpolicy").click(); }

            //设置 三个按钮
            var orgiDiv = $("div:contains('特约及争议解决方式')")[4];
            var buttonOne = $("<input class='btn btn-warming pull-right' style='margin-left:15px;' type='button' value='工行特约' />");
            var buttonTwo = $("<input class='btn btn-warming pull-right' style='margin-left:15px;' type='button' value='郑行特约' />");
            var buttonThree = $("<input class='btn btn-warming pull-right' style='margin-left:15px;' type='button' value='中行特约' />");
            var buttonFore = $("<input class='btn btn-warming pull-right' style='margin-left:15px;' type='button' value='杭州特约' />");
var buttonFive = $("<input class='btn btn-warming pull-right' style='margin-left:15px;' type='button' value='博睿特约' />");
            var isDahuoVal = GM_getValue("isDahuo");

            $(buttonOne).click(function () {
                if (isDahuoVal == 1 || isDahuoVal == 2) {
                    $("#commercial").val("").val("第一受益人为中国工商银行股份有限公司郑州花园路支行，该车赔案及退保手续由广州中豫融资租赁有限公司代为办理。");
                } else {
                    $("#commercial").val("").val("第一受益人为中国工商银行股份有限公司郑州花园路支行，该车赔案及退保手续由广州中豫融资租赁有限公司代为办理。");
                }
                $("#submitCommercial").click();
            });
            $(buttonTwo).click(function () {
                if (isDahuoVal == 1 || isDahuoVal == 2) {
                    $("#commercial").val("").val("第一受益人为郑州银行股份有限公司汽车金融中心，该车赔案及退保手续由广州中豫融资租赁有限公司代为办理。");
                } else {
                    $("#commercial").val("").val("第一受益人为郑州银行股份有限公司汽车金融中心，该车赔案及退保手续由广州中豫融资租赁有限公司代为办理。");
                }

                $("#submitCommercial").click();
            });

            $(buttonThree).click(function () {
                $("#commercial").val("").val("第一受益人为中国银行股份有限公司郑州文化支行，该车赔案及退保手续由广州中豫融资租赁有限公司代为办理。");
                $("#submitCommercial").click();
            });
            $(buttonFore).click(function () {
                $("#commercial").val("").val("此车退保及理赔由郑州华耀汽车销售服务有限公司代为办理。");
                $("#submitCommercial").click();
            });

 $(buttonFive).click(function () {
                $("#commercial").val("").val("1.本保单第一受益人为：河南博睿金融服务有限公司。");
                $("#submitCommercial").click();
            });

            $(orgiDiv).append(buttonOne).append(buttonTwo).append(buttonThree).append(buttonFore).append(buttonFive);
            if ($("#addCommercial tbody").find("tr").length > 0) {
                console.log("已存在特约信息，不再添加");
                return;
            } else {
                var bank = GM_getValue("bank")
                if (bank) {
                    //console.log("存在银行类型信息[" + bank + "]，自动设置特约");

                    //if (bank.indexOf("工") > -1) {
                    //    $(buttonOne).click();
                    //} else if (bank.indexOf("郑") > -1) {
                    //    $(buttonTwo).click();
                    //} else if (bank.indexOf("中") > -1) {
                    //    $(buttonThree).click();
                    //}
                }
            }
        });
    }
    var bdSN = $("#billCode").html();
    if (!bdSN) {
        unsafeWindow.setTimeout(function () {
            bdSN = $("#billCode").html();
            doPage3(bdSN);
        }, 1000);
    } else {
        doPage3(bdSN);
    }

})();
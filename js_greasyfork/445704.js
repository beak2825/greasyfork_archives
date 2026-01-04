// ==UserScript==
// @name         crm
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description   自用
// @author       ripple57
// @match      https://crm.zhipin.com/web/dashboard/customer/my
// @match      https://crm.zhipin.com/web/dashboard/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445704/crm.user.js
// @updateURL https://update.greasyfork.org/scripts/445704/crm.meta.js
// ==/UserScript==
(function () {
  "use strict";

  $(function () {

    let 保留电话数 = 10;
    let 自动挂断时间 = 3000;//座席等待3秒后自动挂断
    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    let notArray = new Array();
    let callNum = 0;
    let runFlag = false;
    let canCall = true;
    let isPhone = true;


    const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      const xhr = this;
      if (
        arguments[1].indexOf("/wapi/zpApm/actionLog/fe/ie/common.json") > -1
      ) {
        return;
      }
      if (arguments[1].indexOf("customer/my/new?") > -1) {
        const getter = Object.getOwnPropertyDescriptor(
          XMLHttpRequest.prototype,
          "responseText"
        ).get;
        Object.defineProperty(xhr, "responseText", {
          get: () => {
            let result = getter.call(xhr);
            //这里可以修改result
            let obj = JSON.parse(result).data.customerModelList;
            console.log("obj===>", obj);
            callNum = 0;
            sleep(1000).then(()=>{autoClick(obj, 0);})
            
            return result;
          },
        });
      }
      return xhrOpen.apply(xhr, arguments);
    };

    function autoClick(objs, index) {
      if (!runFlag) {
        return;
      }
      if (objs.length <= 保留电话数) {
        console.log("点击一键认领");
        $('a:contains("一键认领")')[0].click(); //点击一键认领
        return;
      } else if (objs.length - callNum <= 保留电话数) {
        console.log("点击剩余?个客户未拨打");
        $("a.text-primary:contains('个客户未拨打')")[0].click();
        return;
      } else if (notArray.length >= 10) {
        alert("不能拨打电话的公司达到10个,请删除至10个以下!!!");
        return;
      }
      let curName = objs[index].name;
      console.log("即将拨打公司=====:", curName);
      //已经存在于排除数组,不能拨打
      if (notArray.indexOf(curName) > -1) {
        autoClick(objs, ++index);
      } else {
        sleep(800)
          .then(() => {
            $("a:contains(" + curName + ")")[0].click();
            console.log("点击公司名字:", curName);
            let a1 = setInterval(() => {
              console.log("等待boss按钮出现"+a1);
              if ($(".category:eq(1)").length > 0) {
                clearInterval(a1);
                console.log("boss按钮已出现");
                $(".category:eq(1)").click(); //点击boss按钮
                console.log("点击boss按钮");
                let a2 = setInterval(() => {
                  console.log("等待可拨打电话按钮出现"+a2);
                  if ($("div.risk-call").length > 0) {
                    clearInterval(a2);
                    console.log("可拨打电话按钮已出现");
                    if ($('div[class="ui-tooltip risk-call-trigger"]:eq(0)').length > 0) {
                      console.log("点击可拨打电话按钮");
                      $('div[class="ui-tooltip risk-call-trigger"]:eq(0)').click(); //点击可拨打电话
                      sleep(500).then(()=>{
                        let a3 = setInterval(() => {
                          console.log("等待通话框消失"+a3);
                          if ( $('div[class="exhibition drag-handle').length == 0) {
                            clearInterval(a3);
                            console.log("通话框消失");
                            $(".dialog-preview-outcall").find('span[ka="dialog_sure"]').click(); //点击确定按钮
                            callNum += 1;
                            $("#callnum").text("自动拨打数：" + callNum);
                            console.log("拨打后关闭侧边栏按");
                            $(".ti-close").click(); //左侧关闭侧边栏按
                            if(isPhone){
                             autoClick(objs, ++index);
                            }else{
                             sleep(自动挂断时间).then(()=>{
                             //click 挂端
                                 $(".exhibition-action>a.icon-hang-up")[0].click()
                                 autoClick(objs, ++index);
                             })
                            }

                          }
                        }, 100);
                      })
                      // return sleep(500);
                    } else {
                      console.log("不存在可拨打电话按钮");
                      //curName 不能打通
                      notArray.push(curName);
                      // return -1;
                      console.log("没有拨打直接关闭侧边栏");
                      $(".ti-close").click(); //左侧关闭侧边栏按
                      console.log("没有拨打直接关闭侧边栏后 ,进行下一轮");
                      autoClick(objs, ++index);
                    }
                  }
                }, 100);
              }
            }, 100);
          })
          // .then(() => {
          //   $(".category:eq(1)").click(); //点击boss按钮
          //   console.log("点击boss按钮");
          //   return sleep(2000);
          // });
        //   .then(() => {
        //     if (
        //       $('div[class="ui-tooltip risk-call-trigger"]:eq(0)').length > 0
        //     ) {
        //       console.log("可拨打电话按钮");
        //       $('div[class="ui-tooltip risk-call-trigger"]:eq(0)').click(); //点击可拨打电话
        //       return sleep(500);
        //     } else {
        //       console.log("不存在可拨打电话按钮");
        //       //curName 不能打通
        //       notArray.push(curName);
        //       return -1;
        //     }
        //   })
        //   .then((flag) => {
        //     if (flag == -1) {
        //       console.log("没有拨打直接关闭侧边栏");
        //       $(".ti-close").click(); //左侧关闭侧边栏按
        //       return -1;
        //     } else {
        //       console.log("点击确定拨打电话");
        //       // $(".dialog-preview-outcall").find('span[ka="dialog_cancel"]').click(); //点击取消按钮
        //       $(".dialog-preview-outcall")
        //         .find('span[ka="dialog_sure"]')
        //         .click(); //点击确定按钮
        //       callNum += 1;
        //       $("#callnum").text("自动拨打数：" + callNum);
        //       console.log("拨打后关闭侧边栏按");
        //       $(".ti-close").click(); //左侧关闭侧边栏按
        //       return sleep(500);
        //     }
        //   })
        //   .then((flag) => {
        //     if (flag == -1) {
        //       console.log("没有拨打直接关闭侧边栏后 ,进行下一轮");
        //       autoClick(objs, ++index);
        //     } else if(runFlag){
        //       waitToastRun("用户未接听", () => {
        //         console.log("找到弹框,进行下一轮");
        //         autoClick(objs, ++index);
        //       });
        //     }
        //   });
      }
    }

    setTimeout(() => {
      $("body").before(
        "<div id= 'myadd'><input id = 'isPhone' type='checkbox' name='phone' checked='checked' value='phone'>手机<button id = 'btn' class='btn btn-primary'>开始运行</button><span id = 'callnum'>自动拨打数:0</span></div>"
      );
      $("#myadd")
        .css("left", "600px")
        .css("position", "fixed")
        .css("z-index", "999999");
      $("#btn").click(function () {
        if (runFlag) {
          // callNum = 1;
          runFlag = false;
          $("#btn").text("开始运行");
        } else {
          runFlag = true;
          $("#btn").text("停止运行");
          isPhone =  $('#isPhone')[0].checked
          $("a.text-primary:contains('个客户未拨打')")[0].click();
          // waitToastRun("禁止外呼", () => {
          //   console.log("找到了禁止外呼========");
          // });
        }
      });
    }, 1000);

    function waitToastRun(txt, fun) {
      let a1 = setInterval(() => {
        console.log("等待toast: " + txt + "出现");
        if ($(".toast-con:contains(" + txt + ")").length > 0) {
          clearInterval(a1);
          console.log(txt + "已出现");
          fun();
        }
      }, 500);
    }
    function waitClick() {
      let a1 = setInterval(() => {
        console.log("等待出现");
        if ($(".toast-con:contains(" + txt + ")").length > 0) {
          clearInterval(a1);
          console.log("已出现");
        }
      }, 100);
    }
    /**
  $('.category:eq(1)').click()//点击boss按钮
  $('div[class="ui-tooltip risk-call-trigger"]')[0].click()//点击可拨打电话
  $(".dialog-preview-outcall").find('span[ka="dialog_sure"]').click()//点击确定按钮
  $(".dialog-preview-outcall").find('span[ka="dialog_cancel"]').click()//点击取消按钮
  $(".ti-close").click()//左侧关闭侧边栏按钮
  $('a.text-primary:contains("个客户未拨打")')[0].click()//个客户未拨打 点击
  $('a:contains("一键认领")')[0].click();//点击一键认领
  */
  });






})();

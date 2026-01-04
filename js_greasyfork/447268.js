// ==UserScript==
// @name         融智增强
// @namespace    https://torwe.net
// @require      http://code.jquery.com/jquery-migrate-1.2.1.js
// @version      2.4
// @author       李贞辉
// @match        https://www.cctrcloud.net/*
// @run-at       document-end
// @license      MIT License
// @description  作用:1、自动显示答案  2、调整了页面布局，更紧凑   3、快捷键操作，减少鼠标移动。4、自动切换为减法模式
// @downloadURL https://update.greasyfork.org/scripts/447268/%E8%9E%8D%E6%99%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447268/%E8%9E%8D%E6%99%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //使用方法：
    //1、回答正确：按键盘上的D键，然后在批改区域点击鼠标，出现对号后，按S键保存，进入下一题。如果阅卷痕迹没有添加成功，则重复操作。如果阅卷痕迹添加错误，可以按R键，重新添加。
    //2、回答半对：按键盘上的B键，1秒内在批改区域点击鼠标，出现半对号后，默认会选择中间的分值，确认分值无误，则在批改区域点击鼠标，出现负分后，按S键保存，进入下一题。如果阅卷痕迹没有添加成功，则重复操作。如果阅卷痕迹添加错误，可以按R键，重新添加。
    //3、回答错误：按键盘上的C键，1秒内在批改区域点击鼠标，出现错号后，1秒后再在批改区域点击鼠标，出现负分后，按S键保存，进入下一题。如果阅卷痕迹没有添加成功，则重复操作。如果阅卷痕迹添加错误，可以按R键，重新添加。
    //4、快捷键设置    对:D键  错:C键 半对:B键  保存:S键  删除全部批注:A键  重阅:R键  上一题:T键  下一题:Y键  数字:扣相应的分数，例如按数字1表示扣1分，按数字0表示扣10分。

    $(document).keyup(function (e){

        let evt =window.event || e;
        if(evt.keyCode == 68){  // D键
            console.log("对");
            //绘制
            //             var CANVAS=document.querySelector("#tui-image-editor > div.tui-image-editor-main-container > div.tui-image-editor-main > div.tui-image-editor-wrap > div > div > div > div > canvas.upper-canvas");
            //             var context=CANVAS.getContext("2d");
            //             var img=new Image();
            //             img.onload=function() {
            //                 context.drawImage(img,0,0,img.width,img.height);
            //             }
            //             img.src="https://www.cctrcloud.net/admin/modules/exam/templates/default/marking_paper/icon/icon_right.svg";

            document.querySelector("#icon_list > div.icon_imglist.check_mark").click();

            //点击满分
            setTimeout(() => {
                document.querySelector("#full_marks").click();
            }, 500);

        }


        if(evt.keyCode == 67){  // C键
            console.log("错");
            document.querySelector("#icon_list > div.icon_imglist.check_error").click();

            setTimeout(() => {
                $(".score_list>div").eq($(".score_list>div").length-1).click();
            }, 1000);
        }


        if(evt.keyCode == 66){  // B键
            console.log("半对");
            document.querySelector("#icon_list > div.icon_imglist.check_harf").click();

            //点击半对分数，所有分数的长度*0.75，然后四舍五入取整，再减1
            setTimeout(() => {
                $(".score_list>div").eq(($(".score_list>div").length*3/4).toFixed(0)-1).click();

            }, 1000);

        }

        if(evt.keyCode ==83){  //S键
            console.log("保存");
            document.querySelector("#fraction_preser").click();
        }

        if(evt.keyCode ==65){  //A键
            console.log("删除全部批注");
            document.querySelector("#tui-image-editor > ul > li.tie-btn-deleteAll.tui-image-editor-item.help.enabled").click();
        }

        if(evt.keyCode ==81){  //A键
            console.log("删除批注");
            document.querySelector("#tui-image-editor > ul > li.tie-btn-delete.tui-image-editor-item.help.enabled").click();
        }

        if(evt.keyCode ==88){  //X键
            console.log("显示试题");
            document.querySelector("#exam_content > div.isshow").click();
            setTimeout(() => {
                $("#exam_answer").attr("style","display: block;height: 50%;");
            }, 500);

        }

        if(evt.keyCode ==74){  //J键
            console.log("减法");
            document.querySelector("#fraction_subtraction").click();
        }

        if(evt.keyCode ==82){  //R键
            console.log("重阅");
            document.querySelector("#fraction_clear").click();
            //设置为减法
            console.log("减法");
            document.querySelector("#fraction_subtraction").click();
        }

        if(evt.keyCode ==84){  //T键
            console.log("上一题");
            document.querySelector("#icon_list > div.icon_imglist.icon_previous > button").click();
        }

        if(evt.keyCode ==89){  //Y键
            console.log("下一题");
            document.querySelector("#icon_list > div.icon_imglist.icon_next > button").click();
        }



        if(evt.keyCode ==49){  //1
            console.log("扣1分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[1]', iframe_document).iterateNext().click();//通过xpath定位元素
        }

        if(evt.keyCode ==50){  //2
            console.log("扣2分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[2]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==51){  //3
            console.log("扣3分");

            document.evaluate('//*[@id="subtraction_list"]/p/div[3]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==52){  //4
            console.log("扣14分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[4]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==53){  //5
            console.log("扣5分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[5]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==54){  //6
            console.log("扣6分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[6]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==55){  //7
            console.log("扣7分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[7]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==56){  //8
            console.log("扣8分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[8]', iframe_document).iterateNext().click();//通过xpath定位元素
        }
        if(evt.keyCode ==57){  //9
            console.log("扣9分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[9]', iframe_document).iterateNext().click();//通过xpath定位元素
        }

        if(evt.keyCode ==48){  //0
            console.log("扣10分");
            document.evaluate('//*[@id="subtraction_list"]/p/div[10]', iframe_document).iterateNext().click();//通过xpath定位元素
        }



    })



    //增加操作提示
    //document.querySelector("body > div.page > div.fixed-bar > div > div > h5").innerText="操作提示:对:D键  错:C键  半对:B键  保存:S键  删除全部批注:A键  重阅:R键  上一题:T键  下一题:Y键";
    document.querySelector("#checkZoom > h4").innerHTML='操作提示:  对:<font color="red">D</font>键  错:<font color="red">C</font>键 半对:<font color="red">B</font>键  保存:<font color="red">S</font>键  删除批注:<font color="red">Q</font>键  删除全部批注:<font color="red">A</font>键  重阅:<font color="red">R</font>键  上一题:<font color="red">T</font>键  下一题:<font color="red">Y</font>键     <font color="red">数字</font>:扣相应的分数，例如按数字1表示扣1分，按数字0表示扣10分。';
    //点击操作提示
    document.querySelector("#checkZoom > h4").click();
    document.querySelector("#explanation > ul > li").innerHTML="";
    document.querySelector("#explanation > ul > li:nth-child(2)").innerHTML="";


    //设置为减法
    console.log("切换为减法模式");
    document.querySelector("#fraction_subtraction").click();


    var time=setInterval(function(){

        //显示试题和答案
        if(document.querySelector("#exam_content > div.isshow").innerText=='显示试题'){
            console.log("显示试题和答案");
            document.querySelector("#exam_content > div.isshow").click();
            setTimeout(() => {
                $("#exam_answer").attr("style","display: block;height: 50%;");
            }, 500);
        }

        //设置答案框架上移
        //var iframe = document.querySelector("#tui-image-editor > div.tui-image-editor-main-container > div.tui-image-editor-main > div.tui-image-editor-wrap > div > div > div");
        //iframe.style.top = "-60px";


        //取消分数的焦点
            document.getElementById('fraction_studentscore').blur();

    },100)

    //框架定位
    var iframe_document=document.getElementById('workspace').contentWindow.document;


})();
// ==UserScript==
// @name         avmoo-dmm-img
// @namespace    avmoo-img
// @version      0.1
// @description  avmoo视频截图链接，批量获取，big-image
// @author       zip11guge
// @match        https://avmoo.click/*/movie/*

// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIAAoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+vvLcIiLX7QAAy+0AAMztAADM7QAAzO0AAMztAADM7QAAzO0AAMztAADM7QAAzO0AAMztAADL7SIi1+2+vvLcHh7R8wAA1f8AANL/AADR/wAA0f8AANH/AADR/wAA0f8AANH/AADR/wAA0f8AANH/AADR/wAA0v8AANX/Hh7R8wAAy+0AANH/AADM/wAAzP8AAMn/AADJ/wAAzP8AAMz/AADM/wAAzP8AAMn/AADJ/wAAzP8AAMz/AADR/wAAy+0AAMztAADR/wAAy/8PD8//f3/m/3Z25P8FBc3/AADM/wAAy/8AAMz/a2vh/4SE5/8ZGdH/AADL/wAA0f8AAMztAADM7QAA0f8AAMv/BwfM/9vb+P//////PT3Y/wAAxv8AAMb/ISHT///////v7/z/Dg7O/wAAy/8AANH/AADM7QAAzO0AANH/AADM/wAAyP9vb+L//////8LC8/98fOT/e3vk/7Cw7///////hobn/wAAyP8AAMz/AADR/wAAzO0AAMztAADR/wAAzP8AAMr/ICDT//X1/f///////////////////////Pz+/zEx1v8AAMr/AADM/wAA0f8AAMztAADM7QAA0f8AAMz/AADM/wAAyv+3t/H//////2lp4f9TU93//////8vL9P8AAMv/AADM/wAAzP8AANH/AADM7QAAzO0AANH/AADM/wAAzP8AAMj/X1/f//////9/f+X/ZWXg//////90dOP/AADI/wAAzP8AAMz/AADR/wAAzO0AAMztAADR/wAAzP8AAMz/AADK/xYW0f/w8Pz/6en7/+Li+f/5+f7/IiLT/wAAyv8AAMz/AADM/wAA0f8AAMztAADM7QAA0f8AAMz/AADM/wAAzP8AAMn/pqbt////////////trbx/wAAyv8AAMz/AADM/wAAzP8AANH/AADM7QAAzO0AANH/AADM/wAAzP8AAMz/AADJ/05O2////////////1xc3/8AAMj/AADM/wAAzP8AAMz/AADR/wAAzO0AAMztAADR/wAAzP8AAMz/AADM/wAAzP8HB83/T0/c/1JS3f8LC87/AADL/wAAzP8AAMz/AADM/wAA0f8AAMztAADL7QAA0f8AAMz/AADM/wAAzP8AAMz/AADL/wAAyf8AAMn/AADL/wAAzP8AAMz/AADM/wAAzP8AANH/AADL7R4e0fMAANX/AADS/wAA0f8AANH/AADR/wAA0f8AANH/AADR/wAA0f8AANH/AADR/wAA0f8AANL/AADV/x4e0fO+vvLcIiLX7QAAy+0AAMztAADM7QAAzO0AAMztAADM7QAAzO0AAMztAADM7QAAzO0AAMztAADL7SIi1+2+vvLc
// @grant        GM_setClipboard
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/462056/avmoo-dmm-img.user.js
// @updateURL https://update.greasyfork.org/scripts/462056/avmoo-dmm-img.meta.js
// ==/UserScript==

(function() {
    'use strict';
   //  创建复制视频img（按钮）

    var button = document.createElement("button");

    //按钮 属性
    button.id = "id001";
    button.textContent = "复制img-封面";
    button.style.width = "180px";
    button.style.height = "20px";
    button.style.align = "center";

    //~~~~~~~~~end~~~~~~~

    //~~~~~~~~~~Add Button ~~~~~~~~~~~

    //查找  标题前的 元素
    var x = document.querySelector("h3");



    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    console.log("buttom对象:",x);

    //添加 子元素
    x.appendChild(button);
    //~~~~~~~~~end~~~~~~~


    //~~~~~~~复制视频番号  , 绑定按键点击功能

    button.onclick = function (){

        //dmm big img
        var bigpic = dmm_fm();
        console.log( bigpic);

        // dmm duo img
        var picdmm = picsnap();

        // save  video number
        var tt = videonum ();

        // ini make
        let allini = inicopy(tt,bigpic,picdmm)

        // 复制 剪贴板
        GM_setClipboard( allini );

    }

    // ini copy
    function inicopy(vmz,dmmbg,dmmdt) {

        // ini:  vdnum + chinese
        let vdnum = '[Section]\nfilename=' + vmz + '\nchinesetitle=\n'

        // ini :all title pic
        let picwz = vdnum + 'hbpic='+ dmmbg + '\ndmmpic=' + dmmdt

        return picwz
    }



    // dmm pic
    function picsnap() {

        console.log('点击了按键,复制dmm img');

        var dmmimg=document.querySelectorAll(".sample-box")

        var i;
        //bbcode img
        var dmmwz='';

        for (i = 0; i < dmmimg.length; i++) {

            var picdt = dmmimg[i].href
            console.log(picdt);

            // bbcode
            dmmwz=dmmwz+'[img]'+ picdt +'[/img]'
            //dmmwz=dmmwz+dmmimg[i]

        }



        //修改标题

        //alert(dmmwz);

        return dmmwz;

    }

    // dmm img big pic
    function dmm_fm() {

        var adom = document.querySelector(".bigImage");
        return adom.href;

    }

    function videonum (){



        //获取标题 文本
        var bt1 = document.querySelector('h3');
        var btnr = bt1.innerText

        //删除中文
        var btnr1 = RemoveChinese(btnr);
        console.log('删除中文'+ btnr1 + "数据类型" + typeof(btnr1) );

        // object 转 string
        btnr1 = JSON.stringify(btnr1[0])

        // regexp "
        var reg = new RegExp('"',"g");
        // delete " 全部 g
        btnr1 = btnr1.replace(reg,"");
        // 大写 转 小写
        btnr1 = btnr1.toLowerCase(btnr1)
        //toUpperCase 小写字母转大写

        var mz1 = btnr1
        console.log("video-name:"+ mz1);




        //修改标题
        bt1.textContent = btnr1
        //alert(btnr1);

        return btnr1


    }

    //~~~~~~~提取 视频 编号，去除 非中文

    function RemoveChinese(strValue) {

        //字符串 为空
        if(strValue!= null && strValue != ""){

            //控制台 输出
            console.log("removechinese:"+strValue);

            //正则 表达式 abc-123
            var reg = /^[A-Za-z0-9]{2,8}-\d{3,7}/g;

            var wjjg = reg.exec(strValue)

            //fc-ppv-1234567 特殊 文件名
            if(wjjg == null){
                reg = /^[A-Za-z0-9]{2,8}-[A-Za-z]{3}-[0-9]{7}/g;
                wjjg = reg.exec(strValue)
                return wjjg;

            }

            //alert(wjjg)

            return wjjg;

        }
        else{
            return "";
        }
    }
})();
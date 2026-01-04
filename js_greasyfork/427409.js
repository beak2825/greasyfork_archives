// ==UserScript==
// @name         TextBlocker
// @namespace    http://tampermonkey.net/
// @version      0.0.1a-beta-2021/06/02
// @description   功能如其名，屏蔽网页中的词，比如说问候亲人的语句，眼不见为净。网页右下角会弹出一个圆圈，点击打开设置。导入屏蔽词：通过.csv档案导入，格式为 words,weight 一行，words是屏蔽词，weight是屏蔽的权重，暂时没有实装之后的版本再说（如果有的话）。最下方的输入框是替换的词，填入以后Confirm，刷新一下就好了。 另：因为这个插件只是个期末作业，所以我也不清楚之后会不会去修一些bug，随缘╮(╯▽╰)╭。
// @author       army_red
// @match        http://*/*
// @match        https://*/*
// @icon         https://th.bing.com/th/id/Rc5a1cb30a1fbd54b7162e66c1553c44c?rik=p2lq2y9C0Q16Ug&riu=http%3a%2f%2fp2.music.126.net%2fNtEk0wr-AFaiiHDUFNMolg%3d%3d%2f1386484168453013.jpg%3fsize%3d400x400%26imageView%26thumbnail%3d580x0&ehk=BIplhCK%2fUya08rUBbwSfys9hGtKArBcmCs1C2J9kqzA%3d&risl=&pid=ImgRaw
// @updateurl    https://github.com/army-red/Tampermonkey/raw/main/TextBlocker.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427409/TextBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/427409/TextBlocker.meta.js
// ==/UserScript==

//jQuery.noConflict();




window.text = '';
window.isLoaded = false;
window.replaceText = undefined;

(function() {

    'use strict';
    //
    //var flag = true;
    //定义一个全局弹出层
    window.layerstart = '<div id = "layer" style = "left:0;width:30%;height:360px;z-index: 100;position:fixed;z-index:999;display:none;border-radius: 72px;background: linear-gradient(145deg, #c6cbce, #ebf2f5);box-shadow:  29px 29px 67px #c4c9cc,-29px -29px 67px #f4fbfe;">';
    window.layerstart += '<div style="float: right;text-align:right;padding:0.8em;border-bottom:none;"><a href="javascript:;" onclick="closelayer()" style="color:#ffffff;background-color:#000000;width:80px;height:80px;text-align:center;padding:0.5em;border-radius:40px;padding-left:1em;padding-right:1em;">×</a></div>';
    window.layerend = '</div>';

    //位置修正
    window.layerCenter = function() {
            var bwidth = window.screen.availWidth;
            var bheight = window.screen.availHeight;
            var layertop = (bheight - 720) / 2 + 300;
            var layerleft = (bwidth - 1280) / 2;

            if (layertop <= 70) {
                layertop = "1em";
            } else {
                layertop = layertop + "px";
            }

            //改变css
            //$("#layer").css({"top":layertop,"left":layerleft});
            //原生js改变css
            //alert(layertop);
            document.getElementById("layer").style.top = layertop;
            document.getElementById("layer").style.left = "60%";
        }
        //创建一个遮罩层
    window.keepout = function() {
        var fade = '<div id = "fade" style = "width:100%;height:100%;background:rgba(255, 255, 255, 0.6);z-index: 99;position: fixed;left: 0;top: 0;z-index: 99;" onclick = "closelayer()"></div>';
        //$("body").append(fade);
        var div = document.createElement("div");
        div.innerHTML = fade;
        document.body.appendChild(div);
    }

    //关闭层
    window.closelayer = function() {
        //$("#layer").hide();
        document.getElementById("layer").style.display = "none";
        //showSidebar();
        //$("#layer").remove();
        var layer = document.getElementById("layer");
        layer.parentNode.removeChild(layer);

        //$("#fade").remove();
        var fade = document.getElementById("fade");
        fade.parentNode.removeChild(fade);
    }

    //创建一个显示按钮
    function imgurl() {
        //$("body").append('<div id = "imgbtn" style = "position:fixed;right:1em;bottom:1em;z-index:88;cursor:pointer;" onclick = "showImgurl()"><img src = "https://libs.xiaoz.top/material/image.png" width = "36px" height = "36px" /></div>');
        //使用原生js添加按钮
        var div = document.createElement("div");
        div.innerHTML = '<div id = "imgbtn" style = "position:fixed;right:1em;bottom:1em;z-index:88;cursor:pointer;" onclick = "showImgurl()"><img src = "https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/024f78f0f736afc310558525b319ebc4b7451210.jpg" width = "72px" height = "72px" /></div>';
        document.body.appendChild(div);
    }


    //显示上传按钮
    window.showImgurl = function() {
        var up = layerstart; //upload .csv file
        up += '<div style="width: 100%; height: 100%; padding: 10px;"><br /><br /><h3 style="font-family: "Verdana"; color: #004242; "></h3><div class="combimed file" style="height: 80px"><input id="file" style="position: absolute; color: #dde4e3; opacity: 0.9; margin-bottom: 10px; height: 50px; width: 80%; border-radius: 25px; background: #dde4e3; box-shadow: 10px 10px 30px #386963, -10px -10px 30px #4c8d85; " title="choose files" type="file"accept=".csv" onchange="uploadfile();" /><div id="hideFileInputButton" style="position: absolute; color: #dde4e3; opacity: 1; margin-bottom: 10px; height: 50px; width: 80%; border-radius: 25px; background: #dde4e3; box-shadow: 10px 10px 30px #386963, -10px -10px 30px #4c8d85;pointer-events:none; z-index: 2;"><div style="color: #004242;margin-left:20%;margin-top:10px ;">Click To Upload</div></div></div><button id="btnSave " style="color: black; opacity: 0.9; height: 50px;width: 25%;border-radius: 20px;background: #dde4e3;box-shadow: 4px 4px 8px #386963,-4px -4px 8px #4c8d85;border: none; z-index: 5; margin: 5px; " type="submit" onclick="saveToStorage() ">Upload</button><button id="btnLoadFromLocalStorage " style="color: black; opacity: 0.9; height: 50px;width: 25%;border-radius: 20px;background: #dde4e3;box-shadow: 4px 4px 8px #386963,-4px -4px 8px #4c8d85;border: none; z-index: 5; margin: 5px; " onclick="loadFromLocalStorage() ">Load</button><button id="btnClearLocalStorage " style="color: black; opacity: 0.9; height: 50px;width: 25%;border-radius: 20px;background: #dde4e3;box-shadow: 4px 4px 8px #386963,-4px -4px 8px #4c8d85;border: none; z-index: 5; margin: 5px; " onclick="removeLocalStorage() ">Clear</button><div style="margin-top:20px"><input id="replace" type="text" style="color: black; opacity: 0.9; height: 50px;width: 55%;border-radius: 20px;background: #dde4e3;box-shadow: 4px 4px 8px #386963,-4px -4px 8px #4c8d85;border: none; z-index: 5; " /><button onclick="fetchText()" style="color: black; opacity: 0.9; height: 50px;width: 25%;border-radius: 20px;background: #dde4e3;box-shadow: 4px 4px 8px #386963,-4px -4px 8px #4c8d85;border: none; z-index: 5; ">Cofirm</button></div></div>';
        up += layerend;
        //$("body").append(up);
        var div = document.createElement("div");
        div.innerHTML = up;
        document.body.appendChild(div);

        //$("#layer").show();
        document.getElementById("layer").style.display = "block";

        //显示遮罩
        keepout();
        //居中显示层
        layerCenter();
    }


    window.uploadfile = function() {
        let reads = new FileReader();

        window.file = document.getElementById('file').files[0];
        //alert(window.file)
        reads.readAsText(file, 'utf-8'); //utf-8
        console.log(reads);
        reads.onload = function(e) {
            console.log(e)
                // document.getElementById('result').innerText = this.result
                // document.getElementById('result').innerText = e.target.result;
            window.text = e.target.result;
            // document.getElementById('result').innerText = text + "\nfrom text " + typeof(text);
            window.isLoaded = true;
        };

    }

    window.saveToStorage = function() {
        alert("※上传成功ヽ(･ω･´ﾒ)※ ");
        localStorage.setItem("testForCSV", text);
    }
    window.loadFromLocalStorage = function() {
        alert(localStorage.testForCSV + '\n字体编码: ' + document.charset + "\n 替换文字: " + localStorage.replaceText);
    }
    window.removeLocalStorage = function() {
        localStorage.removeItem("testForCSV");
    }

    window.fetchText = function() {
        window.replaceText = document.getElementById("replace").value;
        localStorage.setItem("replaceText", window.replaceText);
        document.getElementById("replace").value = "";
        //alert(window.replaceText);
        //replace(window.replaceText);
    }

    window.replace = function(replaceText) {
        if (typeof(replaceText) == undefined) {
            replaceText = "**";
        } else {
            replaceText = localStorage.replaceText;
        }

        var file = localStorage.getItem('testForCSV').trim().split("\n");
        // var lists = file;
        var lists = new Array(file.length);
        var weight = new Array(file.length);
        for (var i = 0; i < file.length; i++) {
            var line = file[i].trim().split(",");

            lists[i] = line[0];
            weight[i] = line[1];
        }

        for (var i_loop = 0; i_loop < lists.length; i_loop++) {
            var finder = lists[i_loop]; //要查找的文字
            // alert(typeof(finder));
            var replace = replaceText; //要替换的文字

            //<p>
            for (var j_p = 0; j_p < document.getElementsByTagName("p").length; j_p++) {
                var obj_p = document.getElementsByTagName("p")[j_p];
                var str_p = obj_p.innerHTML;
                //先根据输入数据拆分，再合并拆分的字符串。-->join() 方法用于把数组中的所有元素放入一个字符串。
                var res_p = str_p.split(finder).join("" + replace + "");
                //显示结果
                obj_p.innerHTML = res_p;
            }


            //<i>
            for (var j_i = 0; j_i < document.getElementsByTagName("i").length; j_i++) {
                var obj_i = document.getElementsByTagName("i")[j_i];
                var str_i = obj_i.innerHTML;
                //console.log(str);
                //先根据输入数据拆分，再合并拆分的字符串。-->join() 方法用于把数组中的所有元素放入一个字符串。
                var res_i = str_i.split(finder).join("" + replace + "");
                //显示结果
                obj_i.innerHTML = res_i;
            }

            //<span>
            for (var j_span = 0; j_span < document.getElementsByTagName("span").length; j_span++) {
                var obj_span = document.getElementsByTagName("span")[j_span];
                var str_span = obj_span.innerHTML;
                //console.log(str);
                //先根据输入数据拆分，再合并拆分的字符串。-->join() 方法用于把数组中的所有元素放入一个字符串。
                var res_span = str_span.split(finder).join("" + replace + "");
                //显示结果
                obj_span.innerHTML = res_span;
            }
        }
        // alert(lists);


    }
    imgurl();
    replace(window.replaceText);
    //alert("hi");
    // Your code here...
})();
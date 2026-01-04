// ==UserScript==
// @name         微信客服消息导出
// @namespace    https://greasyfork.org/zh-CN/users/443879-fanzhixin
// @version      0.3
// @description  导出选中的小程序客服消息，包括客户和客服名字，图片地址
// @author       Bill Fan 范志鑫
// @match        https://mpkf.weixin.qq.com/*
// @include     https://mpkf.weixin.qq.com/*
// @run-at document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396374/%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D%E6%B6%88%E6%81%AF%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/396374/%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D%E6%B6%88%E6%81%AF%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(

    function() {
    'use strict';

    // Your code here...


    var iconSize = 24;
    var translationTestSize = 16;
    var icon = document.createElement('div');
    var style = '' +
        'width:24px;' +
        'height:24px;' +
        'margin:4px!important;' +
        '';
    icon.innerHTML = '' +
        '<svg href="javascript:void(0)" style="' + style + '" "width="24" height="24" viewBox="0 0 17 16">' +
        ' <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
        '<g transform="translate(0.968151, 0.000000)" fill="#434343">' +
            '<path d="M11.993,0.031 L4.035,0.031 L4.035,5.983 L11.993,5.983 L11.993,0.031 L11.993,0.031 Z M11.0318493,5 L9.03184926,5 L9.03184926,1 L11.0318493,1 L11.0318493,5 L11.0318493,5 Z" class="si-glyph-fill"></path>' +
            '<path d="M14.0196178,0.031 L13.1109039,0.031 L13.1109039,7.10112134 L2.97331513,7.10112134 L2.97331513,0.031 L2.02037174,0.031 C0.91564095,0.031 0.0209999999,0.950085607 0.0209999999,2.08335637 L0.0209999999,12.9776381 C0.0209999999,14.1109088 0.916646164,15.031 2.02037174,15.031 L14.020623,15.031 C15.1263591,15.031 16.021,14.1109088 16.021,12.9776381 L16.021,2.08335637 L14.0196178,0.031 L14.0196178,0.031 Z M12,13 L4,13 L4,12 L12,12 L12,13 L12,13 Z M12,11 L4,11 L4,10 L12,10 L12,11 L12,11 Z" class="si-glyph-fill"></path>' +
        '</g>' +
    '</g></svg>' +
        '';
    icon.setAttribute('style', '' +
        'width:32px!important;' +
        'height:32px!important;' +
        'display:none!important;' +
        'background:#fff!important;' +
        'border-radius:16px!important;' +
        'box-shadow:4px 4px 8px #888!important;' +
        'position:absolute!important;' +
        'z-index:2147483647!important;' +
        '');

    // 添加翻译图标到 DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
        }
    });
    // 选中变化事件：当点击已经选中的文本的时候，隐藏翻译图标和翻译面板（此时浏览器动作是：选中的文本已经取消选中了）
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';

        }
    });
    // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
            return;
        }


        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY + 12 + 'px';
            icon.style.left = e.pageX + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';

        }
    });
    // 翻译图标点击事件
    icon.addEventListener('click', function (e) {
        var divtime =new RegExp("<div class=\"message_box_time\".*?>","g");
        var divs =new RegExp("<div .*?>","g");
        var spans =new RegExp("<span .*?>","g");
        var ps =new RegExp("<p .*?>","g");
         var as =new RegExp("<a .*?>","g");
         var imgtou =new RegExp("<img class=\"mssage_box_pic\" src=(.*?) .*?>","g");
        var imgsreenshot =new RegExp("<img src=(.*?) .*?>","g");
        var audiorex =new RegExp("<audio .*? src=(.*?) .*?>","g");
        var videorex =new RegExp("<video .*? src=(.*?) .*?>","g");
        var https=new RegExp("\"https://wx.qlogo.cn.*?\"","g");
        var https2=new RegExp("\"https://mmbiz.qpic.cn.*?\"","g");
         var cgi=new RegExp("\"/cgi-bin/kfgetimgdata.*?\"","g");
        var cgivideo=new RegExp("\"/cgi-bin/kfgetvideodata.*?\"","g");
        var cgivoice=new RegExp("\"/cgi-bin/kfgetvoicedata.*?\"","g");

        var text = window.getSelection();
        if (text) {
           var selectionObj = window.getSelection();

　　　　var rangeObj = selectionObj.getRangeAt(0);

　　　　var docFragment = rangeObj.cloneContents();

　　　　var testDiv = document.createElement("div");

　　　　testDiv.appendChild(docFragment);

　　　　var selectHtml = testDiv.innerHTML;
            selectHtml=selectHtml.replace(divtime,"\n");
            selectHtml=selectHtml.replace(divs,"");
            selectHtml=selectHtml.replace(spans,"");
            selectHtml=selectHtml.replace(ps,"");
            selectHtml=selectHtml.replace(as,"");
            selectHtml=selectHtml.replace(imgtou,"$1");
            selectHtml=selectHtml.replace(imgsreenshot,"$1");
            selectHtml=selectHtml.replace(audiorex,"$1");
             selectHtml=selectHtml.replace(videorex,"$1");
            selectHtml=selectHtml.replace(/<\/div>/g,"");
            selectHtml=selectHtml.replace(/<\/span>/g,"");
            selectHtml=selectHtml.replace(/<\/audio>/g,"");
             selectHtml=selectHtml.replace(/<\/video>/g,"");
            selectHtml=selectHtml.replace(/<\/p>/g,"");
            selectHtml=selectHtml.replace(/<\/a>/g,"");
            selectHtml=selectHtml.replace(/mode=small/g,"mode=large");
            selectHtml=selectHtml.replace(/&nbsp;/g," ");
            selectHtml=selectHtml.replace(/&quot;/g,"\"");
            selectHtml=selectHtml.replace(/&amp;/g,"&");
            selectHtml=selectHtml.replace(/\?wx_fmt=jpeg/g,"");
            selectHtml=selectHtml.replace(/\?wx_fmt=png/g,"");
            var arratou=unique (selectHtml.match(https));

            for(let i = 0, len = arratou.length; i < len; i++)
            {

           var inputdata= window.prompt(selectHtml+"\n\n"+arratou[i]+"替换为:");
              selectHtml=selectHtml.replace(new RegExp(arratou[i],'g'),"\n"+inputdata+"：");
            }

            arratou=unique (selectHtml.match(https2));

            for(let i = 0, len = arratou.length; i < len; i++)
            {

            inputdata= window.prompt(selectHtml+"\n\n"+arratou[i]+"替换为:");

               // window.alert(ltemp);
                //window.alert(inputdata);
              selectHtml=selectHtml.replace(new RegExp(arratou[i],'g'),"\n"+inputdata+"：");
            }
           // window.alert(selectHtml);

         var arrimgscreenshot=unique (selectHtml.match(cgi));
          if(arrimgscreenshot.length>0)
            {
                for(let i = 0, len = arrimgscreenshot.length; i < len; i++)
                {
                    //window.alert("https://mpkf.weixin.qq.com"+arrimgscreenshot[i].replace(/\"/g,""));
                    window.open("https://mpkf.weixin.qq.com"+arrimgscreenshot[i].replace(/\"/g,""))
                    inputdata= window.prompt(selectHtml+"\n\n"+arrimgscreenshot[i]+"保存为");
                    //window.alert(selectHtml);
                    //window.alert(arrimgscreenshot[i]);
                    selectHtml=selectHtml.replace(arrimgscreenshot[i],inputdata);



                }


            }
             arrimgscreenshot=unique (selectHtml.match(cgivideo));
          if(arrimgscreenshot.length>0)
            {
                for(let i = 0, len = arrimgscreenshot.length; i < len; i++)
                {
                    //window.alert("https://mpkf.weixin.qq.com"+arrimgscreenshot[i].replace(/\"/g,""));
                    window.open("https://mpkf.weixin.qq.com"+arrimgscreenshot[i].replace(/\"/g,""))
                    inputdata= window.prompt(selectHtml+"\n\n"+arrimgscreenshot[i]+"保存为");
                    //window.alert(selectHtml);
                    //window.alert(arrimgscreenshot[i]);
                    selectHtml=selectHtml.replace(arrimgscreenshot[i],inputdata);



                }


            }
            arrimgscreenshot=unique (selectHtml.match(cgivoice));
          if(arrimgscreenshot.length>0)
            {
                for(let i = 0, len = arrimgscreenshot.length; i < len; i++)
                {
                    //window.alert("https://mpkf.weixin.qq.com"+arrimgscreenshot[i].replace(/\"/g,""));
                    window.open("https://mpkf.weixin.qq.com"+arrimgscreenshot[i].replace(/\"/g,""))
                    inputdata= window.prompt(selectHtml+"\n\n"+arrimgscreenshot[i]+"保存为");
                    //window.alert(selectHtml);
                    //window.alert(arrimgscreenshot[i]);
                    selectHtml=selectHtml.replace(arrimgscreenshot[i],inputdata);



                }


            }
        window.alert(selectHtml);
        }

    });
function unique (arr) {
return Array.from(new Set(arr));
}



})();
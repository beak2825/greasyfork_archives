// ==UserScript==
// @name         rarbg 列表缩略图
// @namespace    waka
// @version      0.2
// @description  rarbg 列表显示种子的截图，可显示小图和大图，参考了本站的其它rarbg js脚本完善了一下
// @author       waka
// @match        https://rarbgunblocked.org/torrents.php?*
// @match        https://proxyrarbg.org/torrents.php*
// @match        https://rarbgmirror.com/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448651/rarbg%20%E5%88%97%E8%A1%A8%E7%BC%A9%E7%95%A5%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/448651/rarbg%20%E5%88%97%E8%A1%A8%E7%BC%A9%E7%95%A5%E5%9B%BE.meta.js
// ==/UserScript==
/* eslint-disable */
(function() {
    'use strict';
    // @link https://blog.csdn.net/pangji0417/article/details/94029462
   var style = document.createElement("style");
   style.type = "text/css";
   var text = document.createTextNode(".rarbg_list_item{box-shadow: 0px 0px 5px 1px #969d99;} .rarbg_list_item:hover{box-shadow: 1px 2px 5px 1px #969d99;}");
   style.appendChild(text);
   var head = document.getElementsByTagName("head")[0];
   head.appendChild(style);
    var plginName = "_rarbg_list_helper";
    var settingTypeKey = plginName+"_display_style";
    var settingHeadKey = plginName+"_heads";
    var settingImageKey = plginName+"_imgsize";
    //list
    var listHtml2 = '<div id="rarbg_lists" style="display: none;flex-wrap: wrap;justify-content: space-between;">';
    var listHtml2End = '</div>';
    //list item template
    var listItem = '<div style="display: flex;flex-direction: column;width:30%;overflow:hidden;padding:10px;margin:10px 0px;border-radius: 20px;" class="rarbg_list_item"><a href="detail_link" target="_blank"><div class="thumb_img" ><img style="max-width:100%" src="img_src"/></div><div class="thubm_title" style="margin-top:10px;"><a href="detail_link">detail_title</a></div></a></div>';
    var listBodyClassName = '.lista2t';
    var settingHtml = '<div id="rarbg_setting1"><div style="display: flex;align-items: center;">Display: <input type="radio" name="display_type" value="table" checked/>Table<input type="radio" name="display_type" value="list"/>List</div><div style="display: flex;align-items: center;">imageSize: <input type="radio" name="imageSize" value="thumb" checked/>Thumb<input type="radio" name="imageSize" value="priview"/>Priview</div><div id="tableHeaderDisplay" style="display: flex;align-items: center;justify-content: flex-start;align-content: center;flex-wrap: nowrap;">Table Header:</div></div>';
    var displayType = "table"; //display style
    var showHeader = [];
    var imageSize  = "thumb";

    function getHeadSetting(){
      var tempHeader = [];
      $("input[name='show_head[]']").each(function(index,item){
         var checked = $(item).prop("checked");
          tempHeader.push(checked?1:0);
      });
      showHeader = tempHeader;
      window.localStorage.setItem(settingHeadKey,JSON.stringify(showHeader));
    }
    // table Headr show
    function showHeaderTds(){
        var headeLen = showHeader.length;
      $(listBodyClassName + ' > tbody tr').each(function(index,item){
        var itemObj = $(item);
         var trObj = itemObj.find("td");
        for(var i = 0;i < headeLen;i++){
          var tempVal = showHeader[i];
          console.log(tempVal);
          if(tempVal <= 0){
               trObj.eq(i).hide();
          }else{
              trObj.eq(i).show();
          }
        }
      });
    }

    $(function(){

         //get val
        var initStyle = window.localStorage.getItem(settingTypeKey);
        console.log(initStyle,"initStyle");
        if(initStyle){
            displayType = initStyle;
        }
        var initHead = window.localStorage.getItem(settingHeadKey);
        console.log(initHead,"initHead");
        if(initHead != null){
          showHeader = JSON.parse(initHead);
        }
        var initImageSize =  window.localStorage.getItem(settingImageKey);
        if(initImageSize){
            imageSize = initImageSize;
        }


        //append target div
        var targetDiv = $("#pager_links");
        var settingTargetDiv = $("#divadvsearch");
        settingTargetDiv.after(settingHtml);

        var tableHeaderDisplay = $("#tableHeaderDisplay");
        var headSetHtml = "Head:";
        //thumb td html
        $(listBodyClassName + ' > tbody tr:eq(0) td:eq(0)').before('<td align="center" class="header6 header40">Thumb</td>');
        var showHeaderLen = showHeader.length;
         $(listBodyClassName + ' > tbody tr:eq(0) td').each(function(index,item){
             var tempTitle = $(item).text();
             var tempChecked = "";
             if(showHeaderLen <= 0){
               tempChecked = 'checked';
               showHeader.push(tempChecked != ""?1:0);
             }else{
               tempChecked = showHeader[index]? "checked":"";
             }
             headSetHtml += '<input type="checkbox" name="show_head[]" value="'+(index)+'" '+tempChecked+'/> '+ tempTitle;
         });
        console.log(showHeader,"showHeader");
        tableHeaderDisplay.html(headSetHtml);
      $(listBodyClassName + ' > tbody tr:gt(0)').each(function(index,item){
        var itemObj = $(item);
           var trObj = itemObj.find("td");
        var tempHtml = '';
         var imgReg = /https?:\/\/[0-9a-zA-Z./]+/ig;
         var htmlA = trObj.eq(1).find("a");
         //htmlA.prop("target","_blank");
         var imgHtml = htmlA.attr("onmouseover");
         var imgResult = imgReg.exec(imgHtml);
         var imgUrl = imgResult[0];
         var parts = imgUrl.split("/");
         if(imageSize != 'thumb'){
           imgUrl = imgUrl.replace("static/over","posters2/"+parts[5].substr(0, 1));
         }
         var detailLink = htmlA.attr("href");
         var detailTitle = htmlA.text();
         var tempItem = listItem.replace("img_src",imgUrl).replace("detail_link",detailLink).replace("detail_link",detailLink).replace("detail_title",detailTitle);
         //console.log(index,tempItem);
         listHtml2 +=tempItem;
         // append thumb html
         trObj.eq(0).before('<td><img src="'+imgUrl+'"/></td>');

      });
      //foreach end
      targetDiv.after(listHtml2);
      $(document).on("click","input[name='display_type']",function(){
          var obj = $(this);
          var val = obj.val();
          if(val == "list"){
              $("#rarbg_lists").css("display","flex");
              $("table.lista2t").hide();
          }else{
              $("#rarbg_lists").css("display","none");
              $("table.lista2t").show();
          }
         window.localStorage.setItem(settingTypeKey,val);
          console.log(obj.val(),"click");
      });
       if(displayType == "list"){
            $("input[name='display_type']").eq(1).trigger("click");
        }
       $(document).on("click","input[name='show_head[]']",function(){
          getHeadSetting();
           console.log(showHeader);
           showHeaderTds();
       });
       if(showHeaderLen > 0){
            showHeaderTds();
       }
        $(document).on("click","input[name='imageSize']",function(){
          var obj = $(this);
          var val = obj.val();
         window.localStorage.setItem(settingImageKey,val);
          console.log(obj.val(),"click");
      });
    });
    // Your code here...
})();
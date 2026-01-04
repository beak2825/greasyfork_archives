// ==UserScript==
// @name         苍穹之恋监控上报
// @description  用于监控苍穹之恋聊天
// @namespace    Yunfeng.Script.SkyOfLove
// @match        http://120.25.58.215/hhsy/center/admin.php*
// @author       HaoJJ
// @version      1.0.4
// @downloadURL https://update.greasyfork.org/scripts/35872/%E8%8B%8D%E7%A9%B9%E4%B9%8B%E6%81%8B%E7%9B%91%E6%8E%A7%E4%B8%8A%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/35872/%E8%8B%8D%E7%A9%B9%E4%B9%8B%E6%81%8B%E7%9B%91%E6%8E%A7%E4%B8%8A%E6%8A%A5.meta.js
// ==/UserScript==
`use strict`;

var uploadUrl = "http://keyword.xiaohao.com/SkyOfLove/UpLoad";

var monitor = function(){

  if($('#analyse-basic a.click-menu[url="admin.php?ctrl=chatmonitor&act=index"]').hasClass('selected')){
    
    //加入监控按钮
    var btnCss = `<style>
                      .my-btn{height: 29px;background-color: #0b9fcce0;cursor: pointer;padding: 0 10px;border-bottom: none;font-size: 12px;color: #fff;border-radius: 3px 3px 0 0;display: block;line-height: 29px;} 
                      .my-btn:hover{background-color: #60c9e8;}
                      .my-btn.active{background-color: #cc400be0;}
                      .my-btn.active:hover{background-color: #ec8e6ae0;}
                  </style>`;
    var $liBtn = $('<li><button class="my-btn">开始监控</button></li>');    
    var $tip = $('<li style="height: 29px;line-height: 29px;padding: 0 5px;color: #0b99efbf;">(暂未开始监控)</li>');
    $('#tabs ul').append(btnCss).append($liBtn).append($tip);
        
    var ajax = jQuery.ajax;
    $liBtn.find('button').toggle(      
      function () {
        $(this).addClass("active");
        $(this).text('停止监控');
        
        var total = 0;
        //修改ajax方法的默认实现
        jQuery.ajax = function(options) {
          if(options.intercept != undefined && options.intercept === true){
            return ajax(options);
          }

          var success = options.success;
          //对用户配置的success方法进行代理
          function ns(datas) {
              var args = arguments;

              var re2 = /&act=chatList&/;
              if(re2.test(options.url)){
                //console.log(datas);

                if(total != datas.iTotalRecords){
                  //默认大于
                  var getCount =  datas.iTotalRecords - total;
                  if(getCount > 100)  getCount = 100; 
                  else if(getCount < 0) getCount = 100;
                  total = datas.iTotalRecords;          
                  
                  var newArr = datas.aaData.slice(0, getCount);
                  if(newArr.length > 0){
                    var upModel = newArr.map(function(row){
                      return {
                        GameName:'苍穹之恋',
                        Aera:row[0],
                        Channel:row[2],
                        Account:row[4],
                        RoleName:row[3],
                        Level:row[5],
                        Content:row[7],
                        CreateTime:row[8],
                        Credit:row[6],
                        VIPLevel:'-1'
                      };                                
                    });
                    //console.log(upModel);

                    $.ajax({
                      url: uploadUrl,
                      data:{rows : JSON.stringify(upModel)},
                      type:'POST',
                      success:function(d){
                        //console.log(d);
                      },
                      intercept:true
                    });             
                  }
                }              
              }
              //这里需要判断用户传入的上下文，具体实现略
              return success.apply(this, args);
          }
          //代理嵌入调用
          options.success = ns;
          return ajax(options);
        }
      $tip.text('(成功开启监控)');        
      },
      function () {
        $(this).removeClass("active");
        $(this).text('开始监控');
        jQuery.ajax = ajax;
        $tip.text('(已经停止监控)');
      }
    );        
  }
  else{
  
  }  
}

$(function(){
    $('#analyse-basic a.click-menu').click(function(){
      setTimeout(monitor,1000);
    });
});

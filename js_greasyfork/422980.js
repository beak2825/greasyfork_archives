// ==UserScript==
// @name         zy一键完成课程
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  zya一键完成课程
// @include      *://zyjnlyg.100anquan.com/daxing/course/courseEleView*
// @include     *://zyjnlyg.100anquan.com*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422980/zy%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422980/zy%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==
$(window).load(function(){

    $('body').append('<input type="button" class="UnlockButton" style="background:transparent;background:rgba(255,192,203,0.7);color:#ffffff;z-index:99999;" value="一键完成当前课程">');
    var btn_Unlock=$(".UnlockButton");
    btn_Unlock.width(200);
    btn_Unlock.height(60);
    btn_Unlock.offset({top:120,left:20});


    btn_Unlock.bind("click",function(){


        var nowurl = window.location.href;
        var nownode = nowurl.lastIndexOf("wareIndex=");
        var bs = nowurl.substring(nownode+10,nowurl.length)
        var nextnode = Number(bs)+1;
        var nextbase = nowurl.match(/(\S*)=/)[0];
        var nexturl = nextbase+nextnode;
        console.log(nexturl);



         var test=document.getElementsByTagName('html')[0].innerHTML;
         var a = test.lastIndexOf("courseWareId = '")
         var courseWareId = test.substring(a+16,a+21)
         var b = test.lastIndexOf("logStudyId = '")
         var logStudyId = test.substring(b+14,b+21)
         var now = test.lastIndexOf('时长是 <span style="color:#ff0000;">')
         var currentPlayTime = test.substring(now +33,now+37)//9999s
         if(isNaN(currentPlayTime)){
             currentPlayTime = test.substring(now +33,now+36)//999s
              if(isNaN(currentPlayTime)){
              alert('时间加载中，异常，请等待1s后再点击！')
                  return;
              }
         }
         var c = test.lastIndexOf("accountName=");
         var accountName = test.substring(c+12,c+31)

        $.ajax({
          url: 'https://zyjnlyg.100anquan.com/daxing/course/updateLogStudyDetailByLogId?logStudyId='+logStudyId+'&courseWareId='+courseWareId+'&currentPlayTime='+currentPlayTime+'&accountName='+accountName,
           type: 'get',
           dataType:'text',
		success:function(data){
                if(data==1){
                   alert('成功')
                }
                console.log(data)
			},
           error: function (err) {
               alert(err+'失败')
               //console.log(err)
          }
       });

    })


        $('body').append('<input type="button" class="btnback" style="background:transparent;background:rgba(143,189,255);color:#ffffff;z-index:99999;" value="返回列表">');
    var btn_back=$(".btnback");
    btn_back.width(200);
    btn_back.height(60);
    btn_back.offset({top:230,left:20});


    btn_back.bind("click",function(){
        window.location.href="https://zyjnlyg.100anquan.com/project/projectV2/11685/Detai"
        })

   $('body').append('<input type="button" class="choose" style="background:transparent;background:rgba(98,172,72,0.5);color:#000000;z-index:99999;" value="1-30:CBBBDA，BCBBBB，ADBACC，CCDCAC，BCBACD">');
    var choose=$(".choose");
    choose.width(600);
    choose.height(60);
    choose.offset({top:350,left:20});

    $('body').append('<input type="button" class="right" style="background:transparent;background:rgba(98,172,72,0.5);color:#000000;z-index:99999;" value="31-50:BABAAA，AABAAA，ABABAB，BB">');
    var right=$(".right");
    right.width(600);
    right.height(60);
    right.offset({top:450,left:20});



})

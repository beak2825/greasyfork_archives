function func() {
    try{
        var i=0;var x1, t1;
        const zf1=15,zf2=25,zf3=15,GXhomepage="https://edu.chinahrt.com/151/learning_center/plan_course/97624af4fdea4442890d4c257dbe83f2";
        setTimeout(function(){
            var test = window.location.href;
            if(test.match("train2/home")){
                //window.alert("1")
                document.querySelector(".el-button.srt-el-button.srt-el-button--primary.srt-el-button-h32").click ();
                //window.close();
            }else if(test.match("grain/course")){
                x1 = document.querySelector(".state").innerText;//学习
                t1 = window.setInterval(study,10000);//重复执行某个方法
            }else if(test.match("train/guide/course")){
                setTimeout( Select,5000);//选视频
            }else if(test.match("train/pointView")){
                //nldxz(); //能力点选择
                document.querySelector ('.ability-task-title').click()
                setTimeout(function(){ page(0)},10000);
            }else if(test.match("train/workspace")){
                if(document.querySelectorAll('.score')[3].innerText!=zf1){
                    page(0);
                }else{document.querySelectorAll('.tab-name')[1].click()
                      setTimeout(function(){
                          if(document.querySelectorAll('.score')[3].innerText!=zf2){
                              page(0);
                          }else{document.querySelectorAll('.tab-name')[2].click()
                                setTimeout(function(){
                                    if(document.querySelectorAll('.score')[3].innerText!=zf3){
                                        page(0);
                                    }else{window.alert("恭喜您已学完全部课程！")}
                                },10000)
                               }
                      },10000)
                     }
                //  }else{window.alert("恭喜您已学完全部课程！")}
          //  }else if(test.match("/videoPlay/")){
             //   setTimeout(function(){
                    //console.log("1")
              //      attrset.maxTime=player.V.duration*0.89;
              //      $.ajax({
               //         url: "/videoPlay/takeRecord",
                //        data: {
                 //           studyCode: attrset.studyCode,
                //            recordUrl: attrset.recordUrl,
                 //           updateRedisMap: attrset.updateRedisMap,
                 //           recordId: attrset.recordId,
                 //           sectionId: attrset.sectionId,
                 //           signId: attrset.signId,
                  //          time: attrset.maxTime,
                 //           businessId: attrset.businessId
                  //      },
                 //       dataType: "json",
                 //       type: "post",
                  //      success: function (data) {
                  //          if (console && console.log) {
                   //             console.log(data);
                 //           }
                //        }
                //    })
                //    setTimeout(function(){
                //        window.open(homepage)//打开学习首页
                //        window.close();
                //    },20000)
              //  },10000);
            }else if(test.match("/play_video/")){
                t1 = window.setInterval(GXstudy,10000)//公需科目学习
            }else if(test.match("trainplan_detail")){
                //选择科目学习页面
                setTimeout(function(){
                    var i=0
                    var span=document.querySelectorAll("span")
                    for( i;i<span.length;i++){
                        if(span[i].textContent.match("学习中")||span[i].textContent.match("未开始")){
                            if(span[i].textContent.match("学习中心")== null){
                                //  console.log(i)
                                span[i].click()
                                break;}
                        }
                    }
                    window.close()
                },10000);
            }else if(test.match("plan_course")){
                //GXSelect()//公需科目选择
                setTimeout(function(){
                    document.querySelectorAll(".n-base-selection-input__content")[0].click()
                    setTimeout(function(){
                        document.querySelectorAll(".n-base-select-option__content")[1].click()
                        setTimeout(function(){
                            if(document.querySelectorAll(".n-image.n-image--preview-disabled").length<5){
                                window.alert("恭喜您已学完全部课程！")
                            }else{document.querySelectorAll(".n-image.n-image--preview-disabled")[1].click()}
                            setTimeout(function(){location.reload()},10000)
                        },10000)
                    },10000)
                },10000);
            }else if(test.match("v_selected_course")){
                setTimeout(function(){
                    document.querySelectorAll("label")[1].click()
                    setTimeout(function(){
                        var list=document.querySelectorAll(".bg.pa.tc")
                        if(list.length){
                            list[0].click()
                            //setTimeout(function(){t1 = window.setInterval(location.reload(),60000)},10000)
                            setTimeout(function(){window.close()},10000);
                        }else{window.alert("恭喜您已学完全部课程！")}
                    },5000)
                },10000);
            }else if(test.match("public_course")){
                //选择未完成年份
                setTimeout(function(){
                    var i=0
                    var span=document.querySelectorAll("span")
                    for( i;i<span.length;i++){
                        if(span[i].textContent.match("学习中")){
                            if(span[i].textContent.match("学习中心")== null){
                                break;}
                        }
                    }
                    //console.log(i)
                    for( i;i<span.length;i++){
                        if(span[i].textContent.match("去学习")){
                            break;}
                    }
                    //console.log(i)
                    span[i].click()
                    setTimeout(function(){location.reload()},10000)
                },10000);
            }
        },10000);
        //能力点选择
        function nldxz() {
            var sw=document.querySelectorAll('.ability-task-title');
            if(sw.length!=0){
                if(document.querySelector ('.info').innerText.match("3 个 / 3个")==null){
                    for (i = 0; i < sw.length; i++) {
                        sw[i].click ();
                    }
                    setTimeout(function(){
                        switch(document.querySelector ('.info').innerText) {
                            case "0 个 / 3个":
                                page(0);
                                break;
                            case "1 个 / 3个":
                                page(1);
                                break;
                            case "2 个 / 3个":
                                page(2);
                                break;
                            default:
                        }
                    },5000);
                }else{
                    document.querySelector ('.g-nav-menu-name').click ();
                    setTimeout(function(){
                        location.reload();
                    },5000);
                }
            }else{
                var nldqd=document.querySelectorAll ('span');
                while (nldqd[i].innerText.indexOf('确定(3)') == -1){
                    i++;
                }
                nldqd[i].click ();
                setTimeout(function(){
                    location.reload();
                },5000);
            }
        }
        //切换窗口
        function page(x) {
            document.querySelectorAll ('.task-title')[x].click ();
            window.close();
        }
        //选择视频
        function Select() {
            window.clearInterval(t1);
            var div = document.querySelectorAll(".item-infos.default")
            if(div.length!=0){
                document.querySelector(".img").click ();
                window.close();
            }else{
                document.querySelector ('.ivu-page-next').click ();
                setTimeout( Select,5000);
            }
        }
        //能力点学习
        function study() {
            if(i<7){
                i++;
                var str1 =document.querySelector('.vcp-controls-panel.show');
                var str2 =document.querySelector ('.alarmClock-wrapper');
                //var str3 =document.querySelectorAll(".question-name");
                if(str1!=null){
                    document.querySelector ('.vcp-playtoggle').click ();
                }
                if(str2.style.display==""){
                    str2.click ();
                }
                //if(str3.length!=0){
                //document.querySelectorAll(".ivu-btn.ivu-btn-primary")[1].click ();
                //}
                if(document.querySelector(".scoring-wrapper").style.display!="none"){
                    var mousemove = new Event('mousemove');
                    var x=document.querySelectorAll(".rate-item")
                    x=x[x.length-1];
                    x.dispatchEvent(mousemove);
                    x.click();
                    setTimeout(function(){
                        document.querySelectorAll('.ivu-btn.ivu-btn-primary')[0].click();
                    },3000);
                }
            }else{
                i=0;
                var x2 = document.querySelector(".state").innerText;
                console.log(x2);
                if(x2!=x1){
                    x1=x2;
                }else{
                    window.clearInterval(t1);//你已学完本课,结束本课学习。
                    document.querySelector ('.return-btn').click ();//换课
                }
            }
        }
        function GXstudy() {
            if(document.querySelectorAll(".n-text.__text-q8o5bu-d.text-gray-500")[2].innerText.match("100")){
                window.open(GXhomepage)//打开学习首页
                window.close();
            }else{
                if(document.domain!="chinahrt.com"){
                    document.domain="chinahrt.com"
                }
                var video=document.getElementById('iframe').contentDocument.querySelectorAll('video')
                if(video.length==0){
                    location.reload();
                }else{
                    video=video[0]
                    video.playbackRate=1.5
                    if(video.paused){
                        if(document.querySelectorAll('.video-complete')[0].style.display!="none"){
                            location.reload();
                        }else{
                            video.play()
                        }
                    }
                }
            }


              //      if(document.domain!="chinahrt.com"){
                //    document.domain="chinahrt.com"
               //var video=document.getElementById('iframe').contentDocument.querySelector('video')
                //    if(video.length==0){
                 //       location.reload();
                //    }else{
                 //       if(video.paused){
                  //          video.play()
                  //      }
                   //         if(video.currentTime==video.duration){
                    //            window.open(homepage)//打开学习首页
                     //           window.close();
                     //       }else{
                       //         if(video.currentTime<video.duration*0.89){
                       //             window.open(document.querySelector('iframe').src)
                       //             window.close();
                      //          }
                      //      }
                  //  }
        }
        //公需科目选择
        function GXSelect() {
            document.querySelectorAll(".n-base-selection-input__content")[0].click()
            setTimeout(function(){document.querySelectorAll(".n-base-select-option__content")[1].click()},10000)
            var list=document.querySelectorAll(".titlecolor.text")
            var s=document.querySelectorAll(".button.fr.mt10.border-public.tc.f12.titlecolor")
            for (var i = 0; i < list.length+1; i++) {
                if(i == list.length){
                    list=document.querySelectorAll(".f12")
                    for (i = 0; i < list.length+1; i++) {
                        if(list[i].textContent.match("选课列表")){
                            list[i].click()
                            setTimeout(function(){location.reload()},10000)
                            break;
                        }
                    }
                }
                else{
                    if(s[i].text.match("未学习")){
                        list[i].click()
                        break;
                    }
                }
            }
        }
    }
    catch(err) {
        var t = window.setInterval(location.reload(),10000);
    }
}
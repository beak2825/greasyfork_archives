// ==UserScript==
// @name            DZONGLINETEST
// @namespace    http://tampermonkey.net/
// @version          1.6
// @description    dzonglinetesttools
// @author       shenhua
// @match        *://*.ouchn.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441854/DZONGLINETEST.user.js
// @updateURL https://update.greasyfork.org/scripts/441854/DZONGLINETEST.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function add(question,answer){
        //var data = 'timu='+question+'&daan='+answer+'';
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','http://uptk.shen668.cn/wkapiadd.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("timu="+question+"&daan="+answer+"");//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var addres = JSON.parse(json).ad
                console.log("服务器返回录入结果："+addres+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
            }}
    };


  function search(question,da){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','http://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+question);//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var srhtimu = JSON.parse(json).tm
                var srhdaan = JSON.parse(json).answer
                console.log("服务器返回题目："+srhtimu);

                if(srhdaan.includes("题库未收录该题")&&da!=undefined&&da!=""&&da!=null){
                        add(srhtimu,da)
                        console.log("服务器返回答案："+srhdaan);
                }else{
                        console.log("服务器返回答案："+srhdaan+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }

            }}
     };

 function doSearch(question,opA,opB,opC,opD){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','http://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+question);//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var srhtimu;
                var srhdaan;
                if(json!=null&&json!=""&&json!=undefined){
                    srhtimu = JSON.parse(json).tm
                    srhdaan = JSON.parse(json).answer
                }
                console.log("服务器返回题目："+srhtimu);
                console.log("服务器返回答案："+srhdaan);
                if(opC!=undefined&&opD!=undefined){
                         if(opA.text().indexOf(srhdaan)!=-1){
                                 opA.click();
                         }else if(opB.text().indexOf(srhdaan)!=-1){
                                 opB.click();
                         }else if(opC.text().indexOf(srhdaan)!=-1){
                                 opC.click();
                         }else if(opD.text().indexOf(srhdaan)!=-1){
                                 opD.click();
                         }
                         console.log("原四选项题题目："+ question);
                         console.log("原四选项题选项：\n"+opA.text()+"\n"+opB.text()+"\n"+opC.text()+"\n"+opD.text()+"\n");
               }else if(opC==undefined&&opD==undefined){
                    if(opA.text().indexOf(srhdaan)!=-1){
                                 opA.click();
                    }else if(opB.text().indexOf(srhdaan)!=-1){
                                 opB.click();
                    }
                   console.log("原判断题题目："+ question);
                   console.log("原判断题选项：\n"+opA.text()+"\n"+opB.text());
             }else{
                          if(opA.text().indexOf(srhdaan)!=-1){
                                 opA.click();
                         }else if(opB.text().indexOf(srhdaan)!=-1){
                                 opB.click();
                         }else if(opC.text().indexOf(srhdaan)!=-1){
                                 opC.click();
                         }
                         console.log("原三选项题题目："+ question);
                         console.log("原三选项题选项：\n"+opA.text()+"\n"+opB.text()+"\n"+opC.text()+"\n");
               }
                if(srhdaan!=undefined){
                    if(srhdaan.includes("题库未收录该题")){
                        console.log("由于题库未收录该题，当前为做题界面，请前往录题界面录入该题！\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
                    }else{
                        console.log("已经为本题选择了正确的答案！\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
                         }
                    }
          }}
     };

  var menIndex = $(".return").text().replace(/\s*/g,"");
  console.log("如果想进行录题操作，请确认是否在录题界面，首次进入录题界面和做题界面将不会自动录题和自动做题，若在录题界面，请刷新网页自动开始录题，若在做题界面，请刷新网页自动开始做题................");
  if(menIndex =="返回考试列表"){
      console.log("当前为录题界面，请刷新网页将自动开始录题..........");
      var tmdas=new Array();
      var getSubject = setTimeout(function(){
        $(".subject").each(function(i){
            tmdas[i] = new Array(2);
            if($(".subject").eq(i).text()==undefined){
                console.log("重新获取.......");
            }else{
                  var len = $(".subject").eq(i).children().length - 2;
                  var tm = $(".subject").eq(i).children().eq(0).text().split(""+(i+1)+".")[1].replace(/\s*/g,"");
                  var da = $(".subject").eq(i).text().split("正确答案：")[1].split(" 学生答案：")[0].replace(/\s*/g,"");
                  var opA;
                  var opB;
                  var opC;
                  var opD;
                  if(len==3){
                      opA = $(".subject").eq(i).children().eq(1);
                      opB = $(".subject").eq(i).children().eq(2);
                      opC = $(".subject").eq(i).children().eq(3);
                      tm = tm +"A."+ opA.text().replace(/\s*/g,"").split("A.")[1]+"B."+opB.text().replace(/\s*/g,"").split("B.")[1]+"C."+opC.text().replace(/\s*/g,"").split("C.")[1];
                      if(opA.text().indexOf(da)!=-1){
                                da = opA.text().replace(/\s*/g,"").split("A.")[1];
                      }else if(opB.text().indexOf(da)!=-1){
                                da = opB.text().replace(/\s*/g,"").split("B.")[1];
                      }else if(opC.text().indexOf(da)!=-1){
                                da = opC.text().replace(/\s*/g,"").split("C.")[1];
                      }
                      //console.log("本题选项：\n"+opA.text()+"\n"+opB.text()+"\n"+opC.text()+"\n");
                  }else if(len==4){
                      opA = $(".subject").eq(i).children().eq(1);
                      opB = $(".subject").eq(i).children().eq(2);
                      opC = $(".subject").eq(i).children().eq(3);
                      opD = $(".subject").eq(i).children().eq(4);
                      //console.log("本题选项：\n"+opA.text()+"\n"+opB.text()+"\n"+opC.text()+"\n"+opD.text()+"\n");
                      tm = tm +"A."+ opA.text().replace(/\s*/g,"").split("A.")[1]+"B."+opB.text().replace(/\s*/g,"").split("B.")[1]+"C."+opC.text().replace(/\s*/g,"").split("C.")[1]+"D."+opD.text().replace(/\s*/g,"").split("D.")[1];
                      if(opA.text().indexOf(da)!=-1){
                                da = opA.text().replace(/\s*/g,"").split("A.")[1];
                      }else if(opB.text().indexOf(da)!=-1){
                                da = opB.text().replace(/\s*/g,"").split("B.")[1];
                      }else if(opC.text().indexOf(da)!=-1){
                                da = opC.text().replace(/\s*/g,"").split("C.")[1];
                      }else if(opD.text().indexOf(da)!=-1){
                                da = opD.text().replace(/\s*/g,"").split("D.")[1];
                      }
                    }else if(len==2){
                        opA = $(".subject").eq(i).children().eq(1);
                        opB = $(".subject").eq(i).children().eq(2);
                        //console.log("本判断题选项：\n"+opA.text()+"\n"+opB.text()+"\n");
                        tm= tm +"A."+ opA.text().replace(/\s*/g,"").split("A.")[1]+"B."+opB.text().replace(/\s*/g,"").split("B.")[1];
                        if(opA.text().indexOf(da)!=-1){
                            da = opA.text().replace(/\s*/g,"").split("A.")[1];
                        }else if(opB.text().indexOf(da)!=-1){
                            da = opB.text().replace(/\s*/g,"").split("B.")[1];
                        }
                    }

                     if($(".subject").eq(i).text().indexOf(" 正确 ")!=-1){
                        if($(".subject").eq(i).text().split(" 正确 ")[0].split(""+(i+1)+".")[1]!=undefined){
                            tmdas[i][0] =tm;
                        }else{
                            tmdas[i][0] = tm;
                        }
                        tmdas[i][1] = da;
                        search(tmdas[i][0],tmdas[i][1]);
                        console.log("网页题目："+tmdas[i][0]+"\n网页答案："+tmdas[i][1]);
                    }else{
                        if($(".subject").eq(i).text().split(" 错误 ")[0].split(""+(i+1)+".")[1]!=undefined){
                            tmdas[i][0]=tm;
                        }else{
                            tmdas[i][0]=tm;
                        }
                        tmdas[i][1]=da;
                        search(tmdas[i][0],tmdas[i][1]);
                        console.log("网页题目："+tmdas[i][0]+"\n网页答案："+tmdas[i][1]);
                        }
                   }
             });
            //clearInterval(getSubject);
            },3000);
           console.log(tmdas);
      }else{
          console.log("当前为答题题界面，请刷新网页将自动开始答题..........");
          setTimeout(function(){
              $(".subject").each(function(j){
                  var tm = $(".subject").eq(j).children().eq(0).text().split(""+(j+1)+".")[1].replace(/\s*/g,"");
                  var optm = $(".subject").eq(j);
                  var len = $(".subject").eq(j).children().length - 1;
                  var opA;
                  var opB;
                  var opC;
                  var opD;

                  if(len==3){
                      opA = $(".subject").eq(j).children().eq(1);
                      opB = $(".subject").eq(j).children().eq(2);
                      opC = $(".subject").eq(j).children().eq(3);
                      //tm= tm +"A."+ opA.text().replace(/\s*/g,"").split("A")[1]+"B."+opB.text().replace(/\s*/g,"").split("B")[1]+"C."+opC.text().replace(/\s*/g,"").split("C")[1];
                      //console.log("本题选项：\n"+opA.text()+"\n"+opB.text()+"\n"+opC.text()+"\n");
                      doSearch(tm,opA,opB,opC,opD);
                  }else if(len==4){
                      opA = $(".subject").eq(j).children().eq(1);
                      opB = $(".subject").eq(j).children().eq(2);
                      opC = $(".subject").eq(j).children().eq(3);
                      opD = $(".subject").eq(j).children().eq(4);
                      //console.log("本题选项：\n"+opA.text()+"\n"+opB.text()+"\n"+opC.text()+"\n"+opD.text()+"\n");
                      //tm= tm +"A."+ opA.text().replace(/\s*/g,"").split("A")[1]+"B."+opB.text().replace(/\s*/g,"").split("B")[1]+"C."+opC.text().replace(/\s*/g,"").split("C")[1]+"D."+opD.text().replace(/\s*/g,"").split("D")[1];
                      doSearch(tm,opA,opB,opC,opD);
                    }else if(len==2){
                        opA = $(".subject").eq(j).children().eq(1);
                        opB = $(".subject").eq(j).children().eq(2);
                        //console.log("本判断题选项：\n"+opA.text()+"\n"+opB.text()+"\n");
                        //tm= tm +"A."+ opA.text().replace(/\s*/g,"").split("A")[1]+"B."+opB.text().replace(/\s*/g,"").split("B")[1];
                        doSearch(tm,opA,opB,opC,opD);
                    }
              });
          },3000);
  }


})();

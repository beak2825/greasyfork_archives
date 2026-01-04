// ==UserScript==
// @name        普通话水平测试 - cltt.org
// @namespace   Violentmonkey Scripts
// @match       http://*.cltt.org/signUp.html
// @grant       none
// @version     1.02
// @author      -
// @description 2019/12/7 上午11:31:00
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/394770/%E6%99%AE%E9%80%9A%E8%AF%9D%E6%B0%B4%E5%B9%B3%E6%B5%8B%E8%AF%95%20-%20clttorg.user.js
// @updateURL https://update.greasyfork.org/scripts/394770/%E6%99%AE%E9%80%9A%E8%AF%9D%E6%B0%B4%E5%B9%B3%E6%B5%8B%E8%AF%95%20-%20clttorg.meta.js
// ==/UserScript==
(
  async function(){
    
      var name= "杨锌彤"; //GM_getValue('name', "");//"杨锌彤"
      var id = "441625199802020550" //GM_getValue('id', "");//"441625199802020550"
      var where = "深圳职业技术学院" //GM_getValue('school', "");//"深圳职业技术学院"
      var phone = "13049472195" //GM_getValue('phone', "");//"13049472195"
      var schoolstuid = "16240070" // GM_getValue('stuid', "");//"16240070"
      var schooldepartment = "人工智能学院" //GM_getValue('department', "");//"人工智能学院"
      var is_test = true
    
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    
    window.check =async function(){
      await sleep(3000);
      //深圳
      //document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > div.choose.choose-city > ul > li:nth-child(15) > a").click()
      //test
      if(is_test == true)
        document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > div.choose.choose-city > ul > li:nth-child(22) > a").click()
      
      //添加轮询控制按钮
      var w =document.createElement("button");
      w.innerHTML = '停止/开始'
      w.class = "button-common"
      w.onclick = function(){
          window.stop = -window.stop
          if(window.stop == -1){
            console.log("start runing")
          } 
        else{
          console.log("now stoped")
        }
      }
      document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > h3").appendChild(w)
      
      await sleep(3000);
      //考试点
      var co = document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > div:nth-child(3) > div.choose.choose-list.choose-time > ul").children
      var count = document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > div:nth-child(3) > div.choose.choose-list.choose-time > ul").childElementCount
      flag = true
      window.stop = -1
      
      
      await sleep(3000)
      window.createButton()
      while(flag)
      { 
          while (window.stop == 1){
              await sleep(1000)
          }
      
          for(i = 0 ;i < count; i++){
              co[i].children[0].click()
              await sleep(50)
              //test 添加一个测试位置
              if(is_test == true && i == count-1)
                document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > div:nth-child(3) > div.fill-intro > p.fill-bg.bg-people > strong").innerText = "1"
              if (document.querySelector("#wrap > div:nth-child(2) > div > div.content.content-min-height > online-widget > div > div:nth-child(3) > div.fill-intro > p.fill-bg.bg-people > strong").innerText != "0"){
                  console.log("got one")
                  document.querySelector("#toReadNote").click()
                  await sleep(3000);
                  document.querySelector("#lastRead").click()
                  await sleep(1000)
                  //test 显示第三页信息填写页
                  document.querySelector("#wrap > div:nth-child(4)").style = ""
                  return
              }
            await sleep(1000)
          }
      }
      
    }
    
    window.createButton = async function(){
        var bt =document.createElement("button");
        bt.innerHTML = '自动填写'
        bt.class = "button-common"
        bt.onclick = window.fill
        var div = document.querySelector("#wrap > div:nth-child(4) > div > div.btn.tc").cloneNode()
            
        div.appendChild(bt);

        document.querySelector("#wrap > div:nth-child(4) > div > div.content > p").appendChild(div);
            
    }
    
    window.fill =async function(){
      //get data bind from dom
      var s= ""
      var dic = document.querySelector("#wrap")
      for (var prop in dic) {
        temp = prop.toString()
        if(temp.indexOf("__ko__") != -1)
          {
              s = temp
              break
          }
      }
      if(s == "")
        {
            alert("can't get data bind")
            return 
        }
      console.log(s) 
      
      console.log(document.querySelector("#wrap > div:nth-child(4) > div > div.content > div").innerText)
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-form.clearfix > div > div:nth-child(2) > div > div:nth-child(2) > i").click()
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-form.clearfix > div > div:nth-child(3) > div > div > div > dl > dd:nth-child(2)").click()
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-form.clearfix > div > div:nth-child(4) > div > div.layui-unselect.layui-form-radio.layui-form-radioed > i").click()
      
      //职业
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-form.clearfix > div > div:nth-child(7) > div > div > div > dl > dd:nth-child(5)").click() 

    
      dic[s]["1"+s].context.$data.paramSignUp.name(name.toString())
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-form.clearfix > div > div:nth-child(5) > div > input").click()
      
      dic[s]["1"+s].context.$data.paramSignUp.idcard(id.toString())
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-form.clearfix > div > div:nth-child(5) > div > input").select()
      dic[s]["1"+s].context.$data.paramSignUp.telcontact(phone.toString())
      dic[s]["1"+s].context.$data.paramSignUp.wunit(where.toString())

      
      //展开
      document.querySelector("#spa").click()
      //2016 9
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-msg > div.fill-msg-main > div:nth-child(5) > div > div:nth-child(2) > div > dl > dd:nth-child(6)").click()
      document.querySelector("#wrap > div:nth-child(4) > div > div.content > form > div.fill-msg > div.fill-msg-main > div:nth-child(5) > div > div:nth-child(3) > div > dl > dd:nth-child(10)").click()
      
      dic[s]["1"+s].context.$data.paramSignUp.schoolstuid(schoolstuid.toString())
      dic[s]["1"+s].context.$data.paramSignUp.schooldepartment(schooldepartment.toString())
    }
    
    window.check()
    
      
      
  
  }
)()

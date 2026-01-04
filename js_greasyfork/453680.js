// ==UserScript==
// @name         青骄第二课堂（小学版）何维杰
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  青骄第二课堂自动登录和知识竞赛自动答题
// @author       sangoumiddles
// @match        https://www.2-class.com
// @match        https://www.2-class.com/competition
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @require      https://cdn.bootcss.com/xlsx/0.11.5/xlsx.core.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
 
// @downloadURL https://update.greasyfork.org/scripts/453680/%E9%9D%92%E9%AA%84%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%EF%BC%88%E5%B0%8F%E5%AD%A6%E7%89%88%EF%BC%89%E4%BD%95%E7%BB%B4%E6%9D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453680/%E9%9D%92%E9%AA%84%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%EF%BC%88%E5%B0%8F%E5%AD%A6%E7%89%88%EF%BC%89%E4%BD%95%E7%BB%B4%E6%9D%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    console.log(window);
    if(JSON.stringify(unsafeWindow.__DATA__.userInfo)=="{}"){
      var allDatas;
      var ZHtemp = "";
      var MMtemp = "";
 
      let addExcel = document.createElement("input");
      addExcel.type = "file";
      addExcel.id = "add_file";
      addExcel.addEventListener('change', readWorkbookFromLocalFile, false);
      document.body.appendChild(addExcel);
 
      let css = `
        #add_file{
          position: fixed;
          top: 10px;
          left: 10px;
        }
      `;
      GM_addStyle(css);
 
      function readWorkbookFromLocalFile(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e){
          var data = e.target.result;
          var workbook = XLSX.read(data, {type: 'binary'});
          // 处理excel文件
          handle(workbook);
        };
        reader.readAsBinaryString(file);
      }
 
      // 处理excel文件
      function handle(workbook){
        var datas = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log(datas);
        if(datas.length > 0){
          // 获取列名是汇总列名，避免某行某个字段没有值，会缺少字段
          // 标题
          var title = [];
          // 获取每行数据
          for(let index in datas){// datas数组，index为索引
            for(let key in datas[index]){
              if(-1===title.indexOf(key)){
                title.push(key);
              }
            }
          }
          GM_setValue("zh_data",datas);
          allDatas = GM_getValue("zh_data");
        }
      }
 
 
      function writeZH(){
        document.getElementById('account').setAttribute('value',ZHtemp);
        document.getElementById('account').value=ZHtemp;
 
      }
      function writeMM(){
        document.getElementById('password').setAttribute('value',MMtemp);
        document.getElementById('password').value=MMtemp;
      }
 
      document.onclick = function(){
        allDatas = GM_getValue("zh_data");
        for(var i=0; i<allDatas.length;i++){
 
          if(!allDatas[i]['成绩'] || allDatas[i]['成绩'] == ' ' || allDatas[i]['成绩'] == '0'){
            ZHtemp = allDatas[i]['账号'];
            //console.log("账号"+jsonData[i]['账号']);
            MMtemp = allDatas[i]['密码'];
            break;
          }
        }
        if(event.srcElement.getAttribute("id") == "account"){
          writeZH();
        } else if(event.srcElement.getAttribute("id")=="password"){
          writeMM();
        } else if(event.srcElement.getAttribute("type")=="submit"){
          for(let i=0;i<allDatas.length;i++){
            if(allDatas[i]['账号'] == ZHtemp){
              allDatas[i]['成绩'] = '100';
              GM_setValue("zh_data",allDatas);
            }
          }
        }
      }
    }
 
    else{
 
        console.log("77777");
        if(window.location.href == "https://www.2-class.com/competition"){
          var tiMu=new Array("1.“国际禁毒日”是每年的（  ）。"
          ,"2. 传统毒品一般是指鸦片、海洛因、大麻等流行较早的毒品。"
          ,"3. 药品可以随意服用，不需要遵医嘱。"
          ,"4. “金三角”是指泰国、缅甸、（  ）三国交界的地方（一个区域）。"
          ,"5.“摇头丸”是苯丙胺类的衍生物，属中枢神经（  ）。"
          ,"6. 甲基苯丙胺因其纯品无色透明，像冰一样，故俗称“冰毒”。"
          ,"7. 吸食毒品是违法行为，不是犯罪行为。"
          ,"8. 《中华人民共和国禁毒法》规定，教育行政部门、（  ）应当将禁毒知识纳入教育、教学内容，对学生进行禁毒宣传教育。"
          ,"9. 《中华人民共和国禁毒法》自（  ）起施行。"
          ,"10. K粉呈白色结晶粉末状，易溶于水，可勾兑进饮料和酒水中。"
          ,"11. 从毒品流行的时间顺序看，可分为传统毒品和新型毒品。传统毒品一般是指鸦片、海洛因、大麻等流行较早的毒品。"
          ,"12. 从医学角度看，吸毒成瘾是一种疾病，是（  ）。"
          ,"13. 当发现有人可能正在吸毒或实施涉及毒品的违法犯罪行为时，应该（  ）。"
          ,"14. 当有人威胁我们吸毒时，要将情况主动告知家长和学校，或者打110报警，寻求帮助。"
          ,"15. 当有人以各种借口引诱你吸食毒品或尝试可能是毒品的药丸时，正确的做法是（  ）。"
          ,"16. 当在你身边出现毒品时，正确的做法是（　）。"
          ,"17. 毒品区别于其他毒物的自然属性是（  ）。"
          ,"18. 毒品是使用后能够产生依赖性的物质。"
          ,"19. 《中华人民共和国禁毒法》第四条规定：禁毒工作实行（  ）为主，综合治理，禁种、禁制、禁贩、禁吸并举的方针。"
          ,"20. 毒品与药品，往往具有双重属性，合法为人解除病痛的就是药品。"
          ,"21. 止咳水不能随便乱用，需要遵医嘱。"
          ,"22. 二十世纪（  ），中国获得“无毒国”美誉近三十年。"
          ,"23. 各级人民政府应当建立毒品违法犯罪举报制度。"
          ,"24. 根据（  ）需要，依法可以生产、经营、使用、储存、运输麻醉药品和精神药品。"
          ,"25. 在日常生活中防毒要做到：一是不要听人蛊惑，受人引诱；二是不要与吸毒、贩毒者为伍；三是不要随意接受陌生人的馈赠；四是（  ）。"
          ,"26. 医学上习惯称吸毒为药物滥用。"
          ,"27. 国家鼓励公民、组织开展公益性的禁毒宣传活动。"
          ,"28. 合成毒品直接作用于人的（  ）。"
          ,"29. 各级各类学校必须开设禁毒专题教育课，将禁毒教育列为学校教育的内容。"
          ,"30. 戒毒人员在（  ）等方面不受歧视。有关部门、组织和人员应当在这些方面对戒毒人员给予必要的指导和帮助。"
          ,"31. 戒毒是一个长期的过程，包括生理脱毒与医学治疗、（  ）、善后辅导与回归社会三个阶段。"
          ,"32. “金新月”国际毒源地是指以下哪几个国家的交界地带？"
          ,"33. 咖啡因是从茶叶、咖啡果中提炼出来的一种生物碱，是国家管制的精神药品，所以人们喝茶、喝咖啡的行为是吸毒。"
          ,"34. 麦角二乙胺（LSD），俗称“邮票”、“贴纸”，是一种强烈的致幻剂。"
          ,"35、关于“笑气”，下列说法正确的是：（  ）①是一种无色有甜味气体，具有轻微麻醉作用，能使人发笑②不是毒品，但同样具有成瘾性③滥用会对神经系统造成永久伤害，严重者可致瘫痪等④“嗨气球”等“暗语”很可能是在说“笑气”"
          ,"36. 南美的（　）、秘鲁、玻利维亚是可卡因的最大生产基地，俗称“银三角”。"
          ,"37. 李某发现儿子小强吸毒后，便将其关在家中，并与家人轮流看守令其戒毒。起初，断了毒品的小强呼天喊地，半个月后，小强又恢复了正常。试问小强是否已全部戒除毒瘾？（  ）"
          ,"38. 你的好朋友在娱乐场所给你一种样子像糖果一样的东西，说特别好玩，让你尝尝。你的选择应该是：（  ）"
          ,"39. 有人引诱你吸食一些不明来源的小零食、饮料等，你应该如何应对？"
          ,"40. 你认为一个家庭如何才能“远离毒品”？（  ）"
          ,"41. 青少年如何避免吸毒？（  ）"
          ,"42. 青少年吸毒的原因是什么？（  ）"
          ,"43. 珍爱生命，远离毒品，要做到（  ）①树立自我保护意识②养成良好习惯③具备禁毒知识④掌握拒毒技巧"
          ,"44. 人们常说“毒品猛于虎”，毒品的危害除了对身心的危害，严重摧残吸毒者的身体之外，还包括（  ）。"
          ,"45. 如果有同学或好朋友吃了一些东西以后，发生昏厥、呕吐或是抽搐等不适症状，我们可以拨打120急救电话。"
          ,"46. 身体脱毒只是戒毒过程的第一步，最根本上的是要彻底摆脱（　），才能达到彻底康复。"
          ,"47. 王某在自己花盆里种植5株罂粟用来欣赏美丽花朵，这是允许的 。"
          ,"48. 世界卫生组织将每年（  ）定为“世界艾滋病日”。"
          ,"49. 毒品预防教育的重点对象是（　）。"
          ,"50. 吸毒的危害有哪些方面？（  ）"
          ,"51. 吸毒会损害人的呼吸系统、消化系统、心血管系统、免疫系统和神经系统，感染各种疾病。"
          ,"52. 吸毒行为可以通过采集吸毒嫌疑人的血液、尿液、毛发等检测出来。"
          ,"53. 吸毒人员是违法者，也是（  ）。"
          ,"54. 大剂量吸食大麻可造成幻觉、妄想、精神失常。"
          ,"55. 小明今年上五年级，沉迷于网络游戏，然后到黑网吧去上网，结交了不良的朋友，最后染上了烟瘾和学会了吸毒。这个故事告诉我们什么道理？（  ）"
          ,"56. 摇头丸主要出现在慢摇吧、迪厅等娱乐场所，青少年应拒绝去这些场所。（  ）"
          ,"57. 远离毒品的自我保护方法有（　）。"
          ,"58. 跳跳糖、奶茶、咖啡包等不是毒品，但是毒贩会把毒品伪装成“跳跳糖、奶茶、咖啡包”等，我们要保持警惕。"
          ,"59. 小学生应该怎样做才能远离毒品、拒绝毒品？（  ）①知道常见毒品的名称②了解毒品的个人、家庭危害③知道不良生活行为习惯可能导致吸毒④懂得一些自我保护的常识和拒毒的方法"
          ,"60. 身边的亲戚、朋友、同学或者家长都吸烟，他们递烟给你，你不要，有人说偶尔体验一下没关系，你最好的应对方式应该是（　）。"
          ,"61. 世界上三大毒品产地中哪一个不在亚洲？"
          ,"62. 大麻是目前世界上滥用人数最多的毒品。"
          ,"63. 为了安全起见，我们应该拒绝陌生人给的糖果、点心或任何饮料。（  ）"
          ,"64. “虎门销烟”是哪一天开始的（  ）。"
          ,"65. 未成年人的父母或者其他监护人应当对未成年人进行毒品危害的教育，防止其吸食、注射毒品或者进行其他毒品违法犯罪活动。"
          ,"66. 我国近代史中的第一次“鸦片战争”是哪国发起的？"
          ,"67. 我国禁毒工作的治本之策是（　）。"
          ,"68. 我们的爸爸、爷爷都可以喝酒，所以作为小学生我们也可以喝酒。（  ）"
          ,"69. 吸毒会败坏社会风气，腐蚀人的灵魂，摧毁民族精神。"
          ,"70. 吸毒人群的意外死亡率较一般人群高。"
          ,"71. 吸毒人员身体消瘦是一种常态，而非病态，所以吸食毒品能有效减肥。"
          ,"72. 吸毒如果仅仅偶尔吸一两次，一般都不会上瘾。这种说法（  ）"
          ,"73. 吸毒者不健康的心理有盲目从众、好奇、爱慕虚荣、赶时髦、追求刺激和享乐、赌气或逆反、无知和轻信、自暴自弃等。"
          ,"74. 吸食冰毒以后马上驾驶车辆，容易造成情绪冲动及过度兴奋，从而极易引发严重交通事故。"
          ,"75. 吸食注射毒品成瘾的，应当戒除毒瘾。"
          ,"76. 吸烟会使肺癌的发生几率增加，诱发呼吸系统疾病，从而威胁人们的身体健康。"
          ,"77. 下面表述正确的是？（  ）"
          ,"78. 学生也有一份禁毒的责任。"
          ,"79. 要拒绝毒品，我们除了要知道什么是毒品、知道毒品极易成瘾、知道毒品的危害，还要（　）。"
          ,"80. 以下属于生活技能教育主要内容的是（　）。"
          ,"81. 长期抽烟、喝酒也会产生生理依赖和心理依赖"
          ,"82. 出于观赏的目的，种植大麻、古柯或罂粟就是合法的。以上说法正确吗?"
          ,"83. 止咳露（或止咳水）只是一种常见的中成药，大量服用不会形成药物依赖。这种说法（  ）"
          ,"84. 制定《中华人民共和国禁毒法》的目的是：预防和惩治毒品违法犯罪行为，保护公民身心健康，维护社会秩序。"
          ,"85. 学校毒品预防教育的目标是（  ）"
          ,"86. 学校是毒品预防教育的主阵地，课堂是主渠道"
          ,"87. 新精神活性物质又称："
          ,"88. 不是艾滋病的传播途径的是（  ）"
          ,"89. 不健康的生活方式有？"
          ,"90. 国家禁毒办依托全国青少年毒品预防教育数字化平台，建立科学评比遴选机制，鼓励各地开发制作各类禁毒宣传教育资料，推送全国（  ）。"
          ,"91. 结交朋友越多越好吗？（  ）"
          ,"92. 高雅情趣是（  ）向上的生活情趣，能催人上进，改变人的精神面貌，提高人的文化修养，使生活更加充实且富有意义。"
          ,"93. 目前，（  ）地区是对我国危害最大的毒品来源地。"
          ,"94. 麻醉药品和精神药品属于列管物质，具有（  ）属性。①药品属性；②受管制性；③成瘾性；④滥用危害性。"
          ,"95. 下列属于我国整类列管的非药用类麻醉药品和精神药品的有（  ）①合成大麻素类物质；②色胺类物质；③卡西酮类物质；④芬太尼类物质。"
          ,"96. 芬太尼属于哪种药品？"
          ,"97. 今年6月至11月，中央宣传部、中央网信办、教育部、国家禁毒办等十个部门联合制定方案，在全国集中组织开展防范毒品滥用宣传教育活动。方案明确指出，我国目前列管的麻精药品数量和整类列管的物质数量分别是（  ）。"
          ,"98. 列入下列哪个目录的物质如果被滥用就是吸毒？"
          ,"99. 合成毒品“麻古”是泰语的音译，其主要成分是(  )"
          ,"100. 可卡因的原植物是(  )，曾经是古代美洲原住民的提神草。"
          ,"101. 1909年2月1日，中、日、英、法、俄、德、美、葡等国召开禁毒会议，拉开了国际性禁毒活动的序幕，这次会议的举办地是(  )。"
          ,"102. 近年来，各地禁毒部门积极推进现代科技应用，已经广泛应用了（  ）、（  ）等手段进行毒情监测预警。①污水监测；②毛发检测；③空气监测；④土壤监测。"
          ,"103. 国家禁毒委员会成立于（   ）年，现有公安部、教育部等（   ）个成员单位。"
          ,"104. 第一届全国青少年禁毒知识竞赛于（   ）年举办。"
          ,"105.下列哪一项不属于我国禁毒工作方针。"
          ,"106. 易制毒化学品的生产、经营、购买、运输无须经过许可即可开展。"
          ,"107. 县级以上各级人民政府＿＿将禁毒工作纳入国民经济和社会发展规划，并将禁毒经费列入本级财政预算。"
          ,"108. 未成年人的父母或者其他监护人＿＿对未成年人进行毒品危害的教育，防止其吸食、注射毒品或者进行其他毒品违法犯罪活动。"
          ,"109. 长期吸食大麻才会上瘾，偶尔吸一次不会上瘾。"
          );
 
          var daAn=new Array("1"
          ,"0"
          ,"2"
          ,"0"
          ,"1"
          ,"0"
          ,"0"
          ,"0"
          ,"2"
          ,"0"
          ,"0"
          ,"3"
          ,"0"
          ,"0"
          ,"0"
          ,"2"
          ,"1"
          ,"0"
          ,"0"
          ,"0"
          ,"0"
          ,"1"
          ,"0"
          ,"0"
          ,"1"
          ,"0"
          ,"0"
          ,"2"
          ,"0"
          ,"3"
          ,"1"
          ,"1"
          ,"1"
          ,"0"
          ,"2"
          ,"2"
          ,"1"
          ,"2"
          ,"1"
          ,"0"
          ,"3"
          ,"3"
          ,"3"
          ,"3"
          ,"0"
          ,"2"
          ,"1"
          ,"3"
          ,"0"
          ,"3"
          ,"0"
          ,"0"
          ,"0"
          ,"0"
          ,"3"
          ,"0"
          ,"3"
          ,"0"
          ,"3"
          ,"3"
          ,"2"
          ,"0"
          ,"0"
          ,"0"
          ,"0"
          ,"2"
          ,"0"
          ,"1"
          ,"0"
          ,"0"
          ,"1"
          ,"1"
          ,"0"
          ,"0"
          ,"0"
          ,"0"
          ,"3"
          ,"0"
          ,"3"
          ,"3"
          ,"0"
          ,"1"
          ,"1"
          ,"0"
          ,"2"
          ,"0"
          ,"3"
          ,"3"
          ,"3"
          ,"0"
          ,"2"
          ,"3"
          ,"0"
          ,"2"
          ,"2"
          ,"1"
          ,"3"
          ,"3"
          ,"0"
          ,"3"
          ,"0"
          ,"0"
          ,"0"
          ,"1"
          ,"2"
          ,"1"
          ,"1"
          ,"1"
          ,"1");
          function stripscript(s) 
          { 
            var pattern = new RegExp("[`~!@#$^&*()=|{ 《》}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
            var rs = ""; 
            for (var i = 0; i < s.length; i++) { 
              rs = rs+s.substr(i, 1).replace(pattern, ''); 
            } 
            //var reg = /[0-9a-zA-Z]/g;
            //rs.replace(reg,"");
            rs=rs.replace(/\s+/g,"");   
            return rs;
          } 
        
          unsafeWindow.clickNext = function(){
            let len=document.getElementsByClassName('ant-btn').length;
            if(document.getElementsByClassName('ant-btn')[len-1]){
              console.log(len);
              document.getElementsByClassName('ant-btn')[len-1].click();
            }
          }
          unsafeWindow.selectLabel = function(){
            var len;
            for(var i=0;i<109;i++){
              let timu=document.getElementsByClassName('exam-content-question')[0].innerText;
              if(stripscript(tiMu[i]).search(stripscript(timu)) != -1){
                len = document.getElementsByTagName('label').length;
              //console.log(len);
                for(var j=0;j<len;j++){
                //console.log(len);
                  if(document.getElementsByTagName('label')[j] && daAn[i].search(String(j)) != -1){
                    document.getElementsByTagName('label')[j].click();
                }
              
              }
              break;
            }
            
            }
            if(i == 109){
              document.getElementsByTagName('label')[0].click();
            }
            
          }
          var time=1000;
          for(var i=0;i<20;i++){
            setTimeout("window.clickNext()",time);
            time=time+1000;
            setTimeout("window.selectLabel()",time);
            time=time+1000;
          }
          time=time+500;
          setTimeout("window.clickNext()",time);
          time=time+1000;
          setTimeout("window.location.href='https://www.2-class.com/'",time);
        }   
    }
})();
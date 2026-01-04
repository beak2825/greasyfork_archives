// ==UserScript==
// @name        美年大健康扁鹊主检增强
// @namespace   Violentmonkey Scripts
// @match       *://main-inspection.health-100.cn/*
// @grant       none
// @version     3.1
// @author      Yagami_Kiya
// @license     MIT
// @description 2023/8/25 9:08
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM.setValue
// @icon        https://home.health-100.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/467614/%E7%BE%8E%E5%B9%B4%E5%A4%A7%E5%81%A5%E5%BA%B7%E6%89%81%E9%B9%8A%E4%B8%BB%E6%A3%80%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/467614/%E7%BE%8E%E5%B9%B4%E5%A4%A7%E5%81%A5%E5%BA%B7%E6%89%81%E9%B9%8A%E4%B8%BB%E6%A3%80%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2023 Yagami_Kiya

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


//=============================初始化始=====================================
var allBtn,showBtn,newBtn,doneBtn,mergeBtn,customerInfoBtn,showWindowSearch;//hotKey的声明变量
var mainERROR;//失误,想用一个函数解决,没想好怎么写。遍历所有，输入单值（正则表达式）的函数，正则后，返回T/F
hotKey();
//checkBUS();

if(GM_getValue("setLeftLayer")==null)
{
  GM_setValue("setLeftLayer",1);
  GM_setValue("setLeftLayerText","打开侧边栏(刷新后生效)");//准备换了
}

//if(GM_getValue("infoFlex")==null){GM_setValue("infoFlex",551);}//左边栏(异常信息)宽度
if(GM_getValue("keyBind_New")==null){GM_setValue("keyBind_New",88);}//默认88,X
if(GM_getValue("keyBind_Merge")==null){GM_setValue("keyBind_Merge",83);}//默认83,S
if(GM_getValue("keyBind_Show")==null){GM_setValue("keyBind_Show",90);}//默认90,Z
if(GM_getValue("keyBind_Done")==null){GM_setValue("keyBind_Done",67);}//默认67,C
if(GM_getValue("toggle_Show")==null){GM_setValue("toggle_Show",0);}//自动打开汇总表并锁定的设置,默认打开
//if(GM_getValue("setNullTable")==null){GM_setValue("setNullTable",0);}//关闭空单元格,默认关闭
if(GM_getValue("showBCPhoto")==null){GM_setValue("showBCPhoto",1);}//显示回传图像,默认打开(不做按钮设置)
if(GM_getValue("changeTableCell") == null){GM_setValue("changeTableCell",1);}//改变页面表格布局
if(GM_getValue("moveTopSearchBar") == null){GM_setValue("moveTopSearchBar",1);}//移动上侧限制条
//延时0.1s执行内容
setTimeout(function(){
  toggleShowBtn();
},100);
//=============================初始化终=====================================

//=============================菜单面板=====================================
//设置菜单面板按钮：
//开关侧边栏(人名)
let leftLayerBtn = GM_registerMenuCommand(GM_getValue("setLeftLayerText"),function(){

  if(GM_getValue("setLeftLayer") == 1){
    GM_setValue("setLeftLayer",-1);
    GM_setValue("setLeftLayerText","关闭侧边栏");
    //console.log(GM_getValue("setLeftLayer"));
  }
  else{
    GM_setValue("setLeftLayer",1);
    GM_setValue("setLeftLayerText","打开侧边栏(刷新后生效)");
  }

  let waitBtn = GM_registerMenuCommand("等待刷新中，刷新后设置生效，点击刷新",function(){location.reload();},"");
  GM_unregisterMenuCommand(leftLayerBtn);

},"");

//=========================================================================
//设计两个方法用于切换开关[自动打开汇总表，并锁定打开]功能
function toggleShowBtn(){
  var toggleShow;
  //function OFF;
  function ON(){
    GM_setValue("toggle_Show",0);
    GM_unregisterMenuCommand(toggleShow);
    toggleShow = GM_registerMenuCommand("自动打开汇总表并锁定：关",OFF,"H");
  }
  function OFF(){
    GM_setValue("toggle_Show",1);
    GM_unregisterMenuCommand(toggleShow);
    toggleShow = GM_registerMenuCommand("自动打开汇总表并锁定：开",ON,"H");
  }
  if(GM_getValue("toggle_Show")==0){ON();}
  else{OFF();}
}
//=========================================================================
//设置style模块，每100ms执行一次

(function() {
  'use strict';
  var leftLayer,moveTable,moveTableTitle,closeBtn_MoveTable,bcPhoto,tableCell,tabCell,leftTable,leftZYYC,customerPhoto,topSearchBar,tableWindow,tableWindowSearch;
  var cardBodyTag,cardBody,monism;
  var CiTiaoHight;
  var tableWindowChangedTag = 0;
  var isMainPage = true;



//========================================定时执行模块开始=======================================================================
  setInterval(() => {
    //==========================================================================
    //清除左边栏模块
    var leftLayer = document.getElementsByClassName("ant-input");
    if(GM_getValue("setLeftLayer") == 1){
      for(let i=0 ; i < leftLayer.length && leftLayer[i]!=null ; i++ ){
        if (leftLayer[i].placeholder == "请输入姓名或预约号"){
          leftLayer[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }
      }
    }
    //==========================================================================
    //ant-list ant-list-split ant-list-bordered ant-list-grid imgs
    //删除彩超图像显示模块 开关:showBCPhoto 1显示 0不显示
    var bcPhoto = document.getElementsByClassName("ant-list ant-list-split ant-list-bordered ant-list-grid imgs");
    if(GM_getValue("showBCPhoto") == 0){
      for(let q=0 ; q<bcPhoto.length ; q++ ){
        if(bcPhoto[q]!=null){bcPhoto[q].remove();}
      }
    }
    //==========================================================================
    //关闭照片显示
    var customerPhoto = document.getElementsByClassName("ant-col person-image")[0];
    if(customerPhoto != null){customerPhoto.remove();}
    //==========================================================================
    if(GM_getValue("moveTopSearchBar") == 1){
      var topSearchBar = document.getElementsByClassName("ant-form ant-form-inline search")[0];
      if(topSearchBar != null){topSearchBar = topSearchBar.parentNode.parentNode.parentNode.parentNode;}
      if(topSearchBar != null){topSearchBar.style.transform = "translate(90px, -54px) scale(0.9)";}
    }
    //transform: translate(90px, -48px) scale(0.9);


    //==========================================================================
    //更改汇总表结构,改变阴性项目透明度，#淡化

    tableCell = document.getElementsByClassName("ant-table-cell");

    //让首页的已驳回不被干扰
    var mainPage = document.getElementsByClassName("ant-btn ant-btn-primary");
    for (let x = 0 ; x < mainPage.length ; x++){
      if(mainPage[x].innerText == "进入初审工作站")
      {
        isMainPage = true;
        break;
      }
      else if(x == mainPage.length - 1) isMainPage = false;
    }

    //正式代码开始
    if(GM_getValue("changeTableCell") == 1 && !isMainPage){
      for (let t=0 ; t<tableCell.length ; t++){
        if(tableCell[t].innerText == "附件彩超（经阴道）"||tableCell[t].innerText == "附件彩超（经腹部）"){tableCell[t].innerText="附件彩超";}
        //if(regBC.test(tableCell[t].innerText))
        let regNop = RegExp("(^未见明显异常$)|(^无$)|(^未闻及明显异常$)|(^未触及明显异常$)|(^阴性$)|(^窦性心律$)|(^正常心电图$)|(^骨量正常$)|(^未闻及$)|(^未触及$)|(^无历史数据$)|(^体脂率测定正常范围$)|(^未发现明显异常$)|(^双侧乳腺未见占位性病变（BI-RADS 1类）$)");//定义未见异常的正则表达式
        const nopList = ["胆囊形态大小正常，壁光滑，内未见明显异常回声。胆总管不扩张。",
                         "脾脏形态正常，包膜光整，实质回声均匀。",
                         "胰腺形态大小正常，轮廓规整，实质回声均匀，主胰管不扩张。",
                         "双肾形态大小正常，包膜光整，实质回声均匀。集合系统未见分离。",
                         "肝脏形态大小正常，轮廓规整，实质回声均匀，肝内管道结构清晰。门静脉未见扩张。",
                         "甲状腺形态大小正常，边界清晰，内部回声分布均匀，未见明显异常回声。CDFI:未见明显异常血流信号。",
                         "双侧颈总动脉、颈内动脉、颈外动脉管径对称，走行正常，内膜光滑，内中膜未见明显增厚，未见明显斑块回声，动脉管腔未见异常扩张或狭窄。CDFI：双侧颈动脉管腔内血流充盈好。PW：双侧颈动脉血流速度及阻力指数在正常范围。",
                         "双侧椎动脉管径正常，走行自然，内膜光滑，CDFI:管腔内血流充盈良好；PW:血流速度及频谱形态正常。",
                         "窦性心律。",
                         "两侧胸廓对称，双肺纹理增多，两侧肺门未见增大，心影大小形态未见异常，两膈面光整，肋膈角锐利。",
                         "胸廓发育对称，气管纵隔居中，肺门结构清晰，无增大，纵隔不宽，双肺野清晰，肺纹理走行自然，心影外形大小基本正常。肋膈角清晰。膈肌光滑。",
                         "子宫形态大小正常，轮廓光整，肌层回声均匀，内膜不厚，宫腔线居中。宫颈未见明显异常。",
                         "双侧附件区未见明显异常回声。",
                         "双侧乳腺腺体层次结构清晰，内部回声分布均匀，未见明显异常包块回声，CDFI：腺体内未见明显异常血流信号。",
                         "腰1-5椎体顺列，诸椎体骨质、椎间隙、椎间孔及附件均未见明显异常。"
                        ];

        const changeNameList = ["肝脏彩超",
                                "甲状腺彩超",
                                "颈动脉彩超",
                                "乳腺超声",
                                "子宫彩超（经阴道）",
                                "阴道彩超",
                                "子宫彩超（经腹部）",
                                "子宫彩超","胸部正位DR",
                                "胸部CT平扫",
                                "心脏彩超"
                               ];//定义要改变宽度的数组

        if (changeNameList.includes(tableCell[t].innerText)) //改变上面数组内的宽度
        {
          tableCell[t].parentNode.parentNode.style.cssText = "display:table-caption;table-layout:auto;width: 100%;";

          if(tableCell[t].className != "HighLight"){//好像没有意义
          tableCell[t].style.cssText = "display: table-cell;table-layout:auto;width:20%;";
          }//忘了干嘛用的了

          if(tableCell[t].innerText == "子宫彩超（经阴道）"){tableCell[t].innerText="阴道彩超";}
          if(tableCell[t].innerText == "子宫彩超（经腹部）"){tableCell[t].innerText="子宫彩超";}
        }

        if( regNop.test(tableCell[t].innerText) || nopList.includes(tableCell[t].innerText) ) //改变未见异常的透明度
        {
          tableCell[t].style.opacity = 0.2;
          tableCell[t-1].style.opacity = 0.2;
        }
      }
      //========================================================================
      //改变小结的阴性、未见异常的透明度（ant-typography，opacity: value）,仅限小结
        let typography = document.getElementsByClassName("ant-typography");
        let regNo = RegExp("(未见明显异常)|(血管弹性度正常，血管腔未见狭窄)|(骨量正常)|(无历史数据)")
        for(let i = 0 ; i<typography.length ; i++)
        {
          if( regNo.test(typography[i].innerText) ){
            typography[i].style.opacity = 0.2;
          }
        }

      //========================================================================
      //修改描述中正常描述的透明度

      //========================================================================
      //修改HighLight插件的一些效果
      let HighLightEms = document.getElementsByClassName("Highlight");
      for(let HighLightEm of HighLightEms){
        if(HighLightEm.style.boxShadow !=null){
          HighLightEm.style.boxShadow = null;//修改标记，用阴影做标记挺好反正也不需要
          if(HighLightEm.style.backgroundColor=="rgb(235, 255, 238)" && !HighLightEm.innerText.includes("\n") && HighLightEm.parentNode.className != "ant-typography")//CT区分,用HighLight的颜色做标记
            {
              HighLightEm.innerText = HighLightEm.innerText + "\n";
              HighLightEm.style.color = null;
              HighLightEm.style.backgroundColor = null; //清除highlight带来的颜色
            }
          if(HighLightEm.style.color == "rgb(211, 211, 211)")//正常描述
          {
            HighLightEm.style.color = null;
            if(HighLightEm.parentNode.parentNode.style.opacity != 0.2){//已经被淡化的不再次淡化
              HighLightEm.style.opacity = 0.2;
            }
            else if(HighLightEm.parentNode.parentNode.style.opacity == 0.2) HighLightEm.style.opacity = null;
          }
        }
      }
      //========================================================================
      //改一些项目为简称
      var tabCell = document.getElementsByClassName("item-name");
      for (let t=0 ; t<tabCell.length ;t++){


        let regChemical = RegExp("(测定)|(^血常规-3分类$)|(^尿常规$)");
        if( regChemical.test(tabCell[t].innerText) && tabCell[t].style.color != "#ff0000" ) tabCell[t].style.opacity = 1;//改变检验项目透明度

        switch(tabCell[t].innerText)
        {
          case "肝胆脾胰双肾彩超" : tabCell[t].innerText = "腹部彩超";break;
          case "常规心电图检查(12导联)": tabCell[t].innerText = "心电图";break;
          case "胸部低剂量螺旋CT(不出片）":tabCell[t].innerText = "胸部CT";break;
          case "超声骨密度检测": tabCell[t].innerText = "骨密度";break;
          case "外科常规检查(女)": tabCell[t].innerText = "外科(女)";break;
          case "外科常规检查(男)": tabCell[t].innerText = "外科(男)";break;
          case "耳鼻咽喉常规检查": tabCell[t].innerText = "耳鼻喉";break;
          case "内科常规检查": tabCell[t].innerText = "内科";break;
          case "乳腺超声": tabCell[t].innerText = "乳腺彩超";break;
          case "妇科常规检查(已婚)": tabCell[t].innerText = "妇科";break;
          case "妇科彩超（经腹部）": tabCell[t].innerText = "子宫彩超";break;
          case "胸部正位DR(不出片)": tabCell[t].innerText = "胸部DR(正)";break;
          case "视力+色觉检查": tabCell[t].innerText = "视力";break;
          case "眼科检查(外眼、眼底、裂隙灯)": tabCell[t].innerText = "眼科";break;
          case "血清总胆固醇测定": tabCell[t].innerText = "总胆固醇";break;
          case "血清甘油三酯测定": tabCell[t].innerText = "甘油三酯";break;
          case "血清高密度脂蛋白胆固醇测定": tabCell[t].innerText = "高密度脂蛋白";break;
          case "血清低密度脂蛋白胆固醇测定": tabCell[t].innerText = "低密度脂蛋白";break;
          case "血清γ-谷氨酰基转移酶测定": tabCell[t].innerText = "(GGT)谷氨酰转氨酶";break;
          case "血清天门冬氨酸氨基转移酶测定": tabCell[t].innerText = "(AST)谷草转氨酶";break;
          case "血清丙氨酸氨基转移酶测定": tabCell[t].innerText = "(ALT)谷丙转氨酶";break;
          case "血清尿素测定": tabCell[t].innerText = "血清尿素";break;
          case "血清尿酸测定": tabCell[t].innerText = "血清尿酸";break;
          case "血清肌酐测定": tabCell[t].innerText = "血清肌酐";break;
          case "血清肌酸激酶测定": tabCell[t].innerText = "(CK)肌酸激酶";break;
          case "血清肌酸激酶同工酶测定": tabCell[t].innerText = "(CK-MB)肌酸激酶同工酶";break;
          case "癌胚抗原测定（定量）": tabCell[t].innerText = "(CEA)癌胚抗原(定量)";break;
          case "甲胎蛋白测定（定量）" : tabCell[t].innerText = "(AFP)甲胎蛋白(定量)";break;
          case "糖链抗原19-9测定": tabCell[t].innerText = "(CA19-9)糖链抗原19-9";break;
          case "胃泌素17测定":tabCell[t].innerText = "胃泌素17";break;
          case "空腹血糖测定": tabCell[t].innerText = "空腹血糖";break;
          case "液基薄层细胞学检测": tabCell[t].innerText = "TCT";break;
          case "血常规-3分类": tabCell[t].innerText = "血常规";break;
          case "非接触眼压检查": tabCell[t].innerText = "眼压";break;
          case "血清乳酸脱氢酶测定": tabCell[t].innerText = "(LDH)乳酸脱氢酶";break;
          case "碳14尿素呼气试验": tabCell[t].innerText = "C14";break;
          case "碳13尿素呼气试验": tabCell[t].innerText = "C13";break;
          case "糖链抗原125测定": tabCell[t].innerText = "(CA125)糖链抗原125";break;
          case "癌胚抗原测定（定性）": tabCell[t].innerText = "(CEA)癌胚抗原(定性)";break;
          case "甲胎蛋白测定（定性）": tabCell[t].innerText = "(AFP)甲胎蛋白(定性)";break;
          case "糖链抗原15-3测定": tabCell[t].innerText = "(CA15-3)糖链抗原15-3";break;
          case "血清促甲状腺激素测定": tabCell[t].innerText = "(TSH)促甲状腺激素";break;
          case "血清甘油三酯测定": tabCell[t].innerText = "甘油三酯";break;
          case "血清三碘甲状原氨酸测定": tabCell[t].innerText = "(T3)三碘甲状腺原氨酸";break;
          case "血清甲状腺素测定": tabCell[t].innerText = "(T4)甲状腺素";break;
          case "脂联素测定": tabCell[t].innerText = "脂联素";break;
          case "口腔科常规检查": tabCell[t].innerText = "口腔";break;
          case "血清碱性磷酸酶测定": tabCell[t].innerText = "(ALP)碱性磷酸酶";break;
          case "肿瘤标志物三项（D）（男）": tabCell[t].innerText = "癌标3项";break;
          case "动脉硬化检测": tabCell[t].innerText = "动脉硬化";break;
          case "肿瘤标志物三项（A)": tabCell[t].innerText = "癌标3项";break;
          case "妇科彩超（经阴道）": tabCell[t].innerText = "阴道彩超";break;
          case "妇科彩超（经腹部）": tabCell[t].innerText = "子宫彩超";break;
          case "尿液液基薄层细胞学检测": tabCell[t].innerText = "尿TCT";break;
          case "眼底镜检查": tabCell[t].innerText = "眼底";break;
          case "血同型半胱氨酸测定": tabCell[t].innerText = "(HCY)半胱氨酸";break;
          case "肿瘤标志物六项（A）": tabCell[t].innerText = "癌标6项";break;
          case "血脂四项（A）": tabCell[t].innerText = "血脂4项";break;
          case "人免疫缺陷病毒抗体测定": tabCell[t].innerText = "HIV抗体";break;
          case "糖链抗原242测定": tabCell[t].innerText = "(CA242)糖链抗原242";break;
          case "乙肝两对半定性": tabCell[t].innerText = "乙肝";break;
          case "颈椎侧位DR(不出片)": tabCell[t].innerText = "颈椎DR(侧)";break;
          case "肝功能四项（C)": tabCell[t].innerText = "肝功4项";break;
          case "胸苷激酶测定": tabCell[t].innerText = "(TK)胸苷激酶";break;
          case "血清游离甲状腺素测定": tabCell[t].innerText = "游离甲状腺素";break;
          case "血清游离三碘甲状原氨酸测定": tabCell[t].innerText = "游离三碘甲状原氨酸";break;
          case "糖化血红蛋白测定（HPLC法）": tabCell[t].innerText = "糖化血红蛋白";break;
          case "人乳头瘤病毒(HPV)核酸分型检测": tabCell[t].innerText = "HPV23分型";break;
          case "头颅CT平扫(不出片)": tabCell[t].innerText = "头颅CT";break;
          case "动脉粥样硬化指数(计算值)": tabCell[t].innerText = "动脉硬化指数";break;
          case "游离前列腺特异性抗原测定": tabCell[t].innerText = "(fPSA)游离前列腺特异性抗原";break;
          case "冠心病风险指数评估（钙化积分计算）": tabCell[t].innerText = "钙化积分";break;
          case "糖链抗原50测定": tabCell[t].innerText = "(CA50)糖链抗原50";break;
          case "幽门螺杆菌抗体测定": tabCell[t].innerText = "HP抗体";break;
          case "一般检查（含腰臀围）": tabCell[t].innerText = "一般检查";break;
          case "血清总胆红素测定": tabCell[t].innerText = "总胆红素";break;
          case "鳞状细胞癌相关抗原测定": tabCell[t].innerText = "鳞状细胞癌";break;
          case "人乳头瘤病毒(HPV)核酸检测": tabCell[t].innerText = "HPV16/18";break;
          case "粪便隐血试验（定性）": tabCell[t].innerText = "便隐血(定性)";break;
          case "超敏C反应蛋白测定": tabCell[t].innerText = "超敏C";break;
          case "血清间接胆红素(计算值)(非结合胆红素)": tabCell[t].innerText = "间接胆红素";break;
          case "血清直接胆红素测定(结合胆红素)": tabCell[t].innerText = "直接胆红素";break;
          case "血清总蛋白测定": tabCell[t].innerText = "(TP)总蛋白";break;
          case "血清球蛋白(计算值)": tabCell[t].innerText = "(Glb)球蛋白";break;
          case "糖链抗原242测定": tabCell[t].innerText = "(CA242)糖链抗原242";break;
          case "头颅MRI平扫(不出片)": tabCell[t].innerText = "头颅MRI";break;
          case "甲状腺功能3项": tabCell[t].innerText = "甲功3项";break;
          case "胸部侧位DR(不出片)": tabCell[t].innerText = "胸部DR(侧)";break;
          case "抗胰岛素抗体测定": tabCell[t].innerText = "抗胰岛素抗体";break;
          case "空腹血清C肽测定": tabCell[t].innerText = "C肽";break;
          case "血清糖化血清蛋白测定": tabCell[t].innerText = "糖化血清蛋白";break;
          case "血清胱抑素C测定": tabCell[t].innerText = "胱抑素C";break;
          case "空腹胰岛素测定": tabCell[t].innerText = "胰岛素";break;
          case "尿微量白蛋白/尿肌酐(计算值)": tabCell[t].innerText = "尿微量白蛋白/尿肌酐";break;
          case "血脂五项": tabCell[t].innerText = "血脂5项";break;
          case "糖链抗原72-4测定": tabCell[t].innerText = "(CA72-4)糖链抗原72-4";break;
          case "肿瘤标志物12项（男）": tabCell[t].innerText = "癌标12项";break;
          case "甲状腺功能五项": tabCell[t].innerText = "甲功5项";break;
          case "血清白蛋白测定": tabCell[t].innerText = "血清白蛋白";break;
          case "肿瘤标志物六项（B）": tabCell[t].innerText = "癌标6项";break;
          case "双肾输尿管膀胱彩超": tabCell[t].innerText = "泌尿系彩超";break;
          case "总前列腺特异性抗原测定": tabCell[t].innerText = "(PSA)总前列腺特异性抗原";break;
          case "膀胱、输尿管彩超": tabCell[t].innerText = "泌尿系彩超";break;
          case "神经元特异烯醇化酶测定": tabCell[t].innerText = "(NSE)神经元特异烯醇化酶";break;
          case "肝功能7项": tabCell[t].innerText = "肝功7项";break;
          case "红细胞沉降率": tabCell[t].innerText = "血沉";break;
          case "细胞角蛋白19片段测定": tabCell[t].innerText = "(Cyfra21-1)细胞角蛋白19片段";break;
          case "腰椎椎体CT平扫(不出片)": tabCell[t].innerText = "腰椎CT";break;
          case "腰椎侧位DR(不出片)": tabCell[t].innerText = "腰椎DR(侧)";break;
          case "": tabCell[t].innerText = "眼压";break;
          case "": tabCell[t].innerText = "眼压";break;
          case "": tabCell[t].innerText = "眼压";break;
          case "": tabCell[t].innerText = "眼压";break;
        }
      }
      //========================================================================
      if(tableWindowSearch==null){
        tableWindowSearch = document.getElementsByClassName("ant-tabs-tab");
        tableWindowChangedTag = 0;
        //console.log("0");
      }

      if(tableWindowSearch!=null){
        for (let a=0 ; a<tableWindowSearch.length ; a++){
          if(tableWindowSearch[a].innerText =="重要异常"){
            tableWindow = tableWindowSearch[a].parentNode.parentNode.parentNode.parentNode;
            tableWindowChangedTag = 1;
            //console.log("1");
            break;
          }
          if(a==tableWindowSearch.length-1){tableWindowChangedTag = 0;}
        }
      }
      //console.log("2");
      //更改汇总表中内部高度
      if(tableWindowChangedTag == 1){
        //tableWindow.firstElementChild.style.height = tableWindow.parentNode.parentNode.clientHeight - 80 + "px";
        //tableWindow.lastElementChild.firstElementChild.style.height = tableWindow.parentNode.parentNode.clientHeight - 80 + "px"; //2023/10/12
        //tableWindow.style.height = "0px";
      }
      //========================================================================
      //修改汇总表左侧宽度
      var leftZYYC =document.getElementsByClassName("ant-tabs-tab");
      for (let a=0 ; a<leftZYYC.length ; a++){
        if(leftZYYC[a].style.padding !="5px 5px"){leftZYYC[a].style.cssText = "padding:5px 5px";}
      }

      var leftTable = document.getElementsByClassName("ant-tabs-nav-list");
      for(let k=0 ; k<leftTable.length ; k++){
        let reg = RegExp("((待初审)|(已初审)|(已驳回)|(终审驳回)|(外送未完成)|(科室重新提交)|(检查中))");
        if (reg.test(leftTable[k].innerText)){;}//leftTable[k].remove;} //不知为何会有BUG
        else{
          leftTable[k].style.display="flex";
          leftTable[k].style.width="100px";
          leftTable[k].style.padding="0px 5px";
        }
      }
    }
    //==========================================================================
    //扩展异常项目汇总表（34px！）
    moveTable = document.getElementsByClassName("drag-content")[0];
    if(moveTable!=null){
      moveTable.style.paddingLeft = "0px";
      moveTable.style.paddingRight = "0px";
      moveTable.style.paddingTop = "0px";
      moveTable.style.paddingBottom = "0px";
    }
    let searchTitle = document.getElementsByClassName("ant-space-item");
    for(let k=0 ; k < searchTitle.length ; k++){
      if (searchTitle[k].innerText == "查看异常信息及项目结果"){moveTableTitle = searchTitle[k];}
    }
    if(moveTableTitle!=null){moveTableTitle.parentNode.parentNode.style.padding = "0px 0px";}
    //移动关闭按钮（X）
    closeBtn_MoveTable = document.getElementsByClassName("icon-close")[0];
    if(closeBtn_MoveTable!=null){closeBtn_MoveTable.style.cssText="position: absolute;top: 0;right: 0;width: 26px;height: 26px;color: rgba(0,0,0,.45);font-size: 16px;font-style: normal;line-height: 26px;text-align: center;text-transform: none;cursor: pointer;text-rendering: auto;";}

    //==========================================================================
    //修改卡片底色
    cardBodyTag = document.getElementsByClassName("ant-col ant-col-8 item-info");//用这个，两个项目同一个科室时不会变色（合并）
    //cardBodyTag = document.getElementsByClassName("ant-col item-info");//用这个，同一个科室也会变色（合并） 对于科室的检测需要重新考量
    for(let u = 0 ; u < cardBodyTag.length ; u++){
      let cardBody = cardBodyTag[u].parentNode.parentNode.parentNode.parentNode;
      if(cardBody.className == "ant-card-body")
      {
        cardBody.style.color = "rgb(0,0,0,0.85)";//调整透明度

        const redColorList = ["采血室","尿-大便 常规","尿便","尿检"];//变红的项目名
        const greenReg = new RegExp(" \/ ");//变绿的正则

        //console.log(greenReg.test("视力+色觉检查：矫正视力-左眼 / 视力+色觉检查：矫正视力-右眼"));//测试通过

        if(redColorList.includes(cardBodyTag[u].innerText)) {
          cardBody.style.backgroundColor = "rgb(255,207,217,0.5)";//红色
        }
        else if (greenReg.test(cardBodyTag[u].innerText)) {
          cardBody.style.backgroundColor = "rgb(127,255,213,0.5)";//绿色
        }
        else if (cardBodyTag[u].innerText=="") cardBody.style.backgroundColor = "rgb(225,234,255,0.5)"; //没有科室的
        else {
          cardBody.style.backgroundColor = "rgb(225,234,255,0.5)";//原本的蓝色
        };
      }
    }
    //==========================================================================
    //自动关闭一元论
    monism = document.getElementsByClassName("attention")[0];
    let monism_CloseBtn,monismExist;
    if (monism!=null && monism.innerText.includes("备注：红色字体表示词条被命中；加粗表示该词条是重要异常。")) monismExist = true;
    else monismExist = false;
    if(monismExist){
      document.getElementsByClassName("icon-close")[0].click();
    }
    //==========================================================================

    //=========================================================================
    //test

  },15);//0.015s执行一次
})();
//========================================定时执行模块结束=======================================================================

//==============================================================================
//自动建议模块
function autoSuggest(){
  var suggestTextauraList;
  suggestTextauraList = document.getElementsByClassName("ant-input ant-input-status-success");

  for (let k = 0 ; k <leftFlexestTextauraList.length ; k++){
    if(suggestTextauraList[k].value.includes("正常高值血压:")){
      suggestTextauraList[k+1].defaultValue = 'test';
      suggestTextauraList[k+1].value = 'test';
      suggestTextauraList[k+1].addEventListener('input',"test");
      suggestTextauraList[k+1].setAttribute('value', "test");
      alert("2");k++;
    }
    console.log(suggestTextauraList[k].value);
  }
}


//======================================================================================================
//快捷键模块
function hotKey() {
  setInterval(() => {
    allBtn = document.getElementsByClassName('ant-btn ant-btn-ghost');//遍历所有ghost按钮，分配进对应功能
    for (let i = 0; i < allBtn.length; i++) {
      //console.log(allBtn.innerText);
      if (allBtn[i].innerText=="新增词条"){newBtn=allBtn[i];}
      if (allBtn[i].innerText=="合并多项"){mergeBtn=allBtn[i];}
      if (allBtn[i].innerText=="查看异常信息及项目结果"){showBtn=allBtn[i];}
      if (allBtn[i].innerText=="客户体检信息"){customerInfoBtn=allBtn[i];}
    }
    allBtn = document.getElementsByClassName("ant-btn ant-btn-primary");//遍历所有primary按钮，分配进对应功能
    for (let i = 0; i < allBtn.length; i++) {
      if (allBtn[i].innerText=="初审通过"){doneBtn=allBtn[i];}
    }
    if(doneBtn!=null) doneBtn.style.backgroundColor = "red";//染色[初审通过]
//===================================================================================================
//打开汇总界面并锁定打开
    if(GM_getValue("toggle_Show")==1){
      let exist;
      showWindowSearch = document.getElementsByClassName("ant-space-item");
      for(let j = 0 ; j < showWindowSearch.length ; j++){
        if(showWindowSearch[j].innerText == "查看异常信息及项目结果"){ exist = true;break; }
        else{ exist = false; }
      }
      if(!exist&&showBtn!=null&&showBtn.innerText =="查看异常信息及项目结果"){
        showBtn.click();
        //console.log("0");
      }
    }

  }, 100);

  document.addEventListener('keydown', function (event){//JS监听键盘快捷键并点击按钮
    switch (event.altKey&&event.keyCode){
      //case 87:autoSuggest();break; //自动建议按键
      case GM_getValue("keyBind_New"):newBtn.click();break;
      case GM_getValue("keyBind_Merge"):mergeBtn.click();break;
      case GM_getValue("keyBind_Show"):showBtn.click();break;
      case GM_getValue("keyBind_Done"):doneBtn.click();break;
      //case GM_getValue("1"):break;
      //case GM_getValue("2"):break;
    }
  });
}
//==============================================================================================
//检查公交集团是否带色弱
//写的乱七八糟,有空再改吧,冗余变量太多了.
function checkBUS(){
  let name = "123";
  let isCurrentName = false;
  let unit = null;
  let isThatUnit = false;
  let regUnit = new RegExp("公交");
  let isSameone = false;
  let confirmBUG = false;
  let tableUnit,tableUnitList,tableName,tableNameList;
  setInterval(() => {
    tableNameList = document.getElementsByClassName("ant-col name");
    if (tableNameList.length = 1) {//正常情况下只有一个元素
      tableName = tableNameList[0].innerText;
      if(name != tableName){
        isCurrentName = false;
      }
    }
    else if (tableNameList.length != 1) isCurrentName = true;//如果不是一个元素那应该不是在审核界面上

    if(!isCurrentName){//如果是不同人
      name = tableName;
      isCurrentName = true;

      customerInfoBtn.click();

      tableUnitList = document.getElementsByClassName("ant-descriptions-item-content");
      for (let i = 0 ; i < tableUnitList.length ; i++){
        if(regUnit.test(tableUnitList[i].innerText)) {
          unit = tableUnitList[i].innerText;
          break;
        }
        else unit = "不是";
      }

      if(unit == "不是") {
        isThatUnit = false;
        document.getElementsByClassName("ant-modal-close")[0].click();
      }
      else
      {
        isThatUnit = true;
        document.getElementsByClassName("ant-modal-close")[0].click();
      }

      //判断是否是想要的单位
      confirmBUG = false;
    }

    if(!confirmBUG&&isThatUnit){
      if(isThatUnit&&1){//留的接口,判断是否色弱
        if(confirm("公交集团")) confirmBUG = true;
      }
    }
  }, 16);
}

//==========================================================================
//锁定显示信息汇总，和showBtn绑定

//GM_registerMenuCommand("打开设置", setting, "");


      //=====变红所有ClassName是"ant-btn ant-btn-ghost"的元素=========
      //const collection = document.getElementsByClassName("ant-btn ant-btn-ghost");
      //for (let i = 0; i < collection.length; i++) {
      //  collection[i].style.backgroundColor = "red";
      //}
      //============================================================

//0 项目状态
//1 查看历年报告
//2 客户体检信息
//3 超声历史结果
//4 全部项目
//5 初始化
//6 汇总预览
//7 一元论
//8 新增词条
//9 合并多项 83 S
//10 驳回分检

//keycode 65 = a A
//keycode 66 = b B
//keycode 67 = c C
//keycode 68 = d D
//keycode 69 = e E EuroSign
//keycode 70 = f F
//keycode 71 = g G
//keycode 72 = h H
//keycode 73 = i I
//keycode 74 = j J
//keycode 75 = k K
//keycode 76 = l L
//keycode 77 = m M mu
//keycode 78 = n N
//keycode 79 = o O
//keycode 80 = p P
//keycode 81 = q Q at
//keycode 82 = r R
//keycode 83 = s S
//keycode 84 = t T
//keycode 85 = u U
//keycode 86 = v V
//keycode 87 = w W
//keycode 88 = x X
//keycode 89 = y Y
//keycode 90 = z Z

//打开页面3S后打开汇总界面
//setInterval(() => {
//  const collection = document.getElementsByClassName("ant-btn ant-btn-primary");
//  collection[collection.length-1].style.backgroundColor = "red";
//  document.getElementsByClassName('ant-btn ant-btn-ghost')[4].click();
//}, 3000);

//Design For
// _____   ______  __    __  ______   __    __  ______
///\  __`\/\__  _\/\ \  /\ \/\  _  \ /\ \  /\ \/\  _  \
//\ \ \/\ \/_/\ \/\ `\`\\/'/\ \ \L\ \\ `\`\\/'/\ \ \L\ \
// \ \ \ \ \ \ \ \ `\ `\ /'  \ \  __ \`\ `\ /'  \ \  __ \
//  \ \ \\'\\ \_\ \__`\ \ \   \ \ \/\ \ `\ \ \   \ \ \/\ \
//   \ \___\_\/\_____\ \ \_\   \ \_\ \_\  \ \_\   \ \_\ \_\
//    \/__//_/\/_____/  \/_/    \/_/\/_/   \/_/    \/_/\/_/
//                                                          Only


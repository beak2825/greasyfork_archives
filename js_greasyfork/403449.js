// ==UserScript==
// @name        keylol表情包插件
// @namespace   http://tampermonkey.net/
// @version     0.24
// @description Keylol论坛的外挂表情包插件
// @require     http://code.jquery.com/jquery-3.x-git.min.js
// @match       http*://*keylol.com/*
// @author      FoxTaillll
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/403449/keylol%E8%A1%A8%E6%83%85%E5%8C%85%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403449/keylol%E8%A1%A8%E6%83%85%E5%8C%85%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

"use strict";

/** 一个表情集合的类.初始化方式:
 *  name表示表情集合的名字,是一个字符串;
 *  srcList是图片链接列表;
 *  $Parent是一个$对象,表示该表情集应该显示在什么地方,一般是个div
 *  showDebug是一个布尔值,true的话显示大量debug信息.
 */
class FaceSet{

  /* 构造方法 */
  constructor(name,srcList,$Parent,showDebug){
    // 复制初始数据
    this._name = name;
    this._srcList = srcList.slice(0); // 复制
    this._$Parent = $Parent;
    this._showDebug = showDebug;

    // 生成_$Element对象需要的html字符串
    this._html = this._createHtml();
    // 生成的$对象,一个div,用于显示图片集合,初值为null,第一次调用时才生成
    this._$Element = null;
  }

  /* 显示debug用信息,参数可以多个,像console.log一样使用 */
  debugMsg(){
    if(this._showDebug) {
      console.log(...arguments);
    }
  }

  /* 获取名字 */
  getName(){
    return this._name;
  }

  /* 生成html用 */
  _createHtml(){
    var html = "<div>";
    for(var i = 0;i < this._srcList.length;i++){
      var src = this._srcList[i];
      html += `<img src=${src} style=height:50px></img>`;
    }
    html += "</div>";
    this.debugMsg(html);
    return html;
  }

  /* 在jaParent中显示图像. */
  show(){
    // 若尚未生成,先生成
    if(!this._$Element){
      this._$Element = $(this._html);
      this._$Parent.append(this._$Element);
    }
    // 显示
    this._$Element.css({'display':'block'});
  }

  /* 隐藏 */
  hide(){
     this._$Element.css({'display':'none'});
  }

}

/** setycyas自制的表情插件类.用于在任意textarea上方添加表情插件.初始化方法:
 * $textarea:需要使用插件的textarea,$对象;
 * faceTable:一个{},key为表情分类字符串,value是一个列表,列表内容为图片链接;
 * showDebug:布尔值,设定是否显示debug信息.
 * 构造方法不会加入表情包,必须执行main().
 */
class SetycyasFacePlugin {

  constructor($textarea,faceTable,showDebug,beforeElement) {
    //复制初始变量
    this._$textarea = $textarea;
    this._faceTable = faceTable;
    this._showDebug = showDebug;
    this._beforeElement = beforeElement;

    //设置菜单
    this._$menu = $("<div id=faceMenu></div>");
    this._$menu.css({
      "line-height":"30px",
    });
      if ($textarea.attr("id") == "postmessage") {
          this._$menu.css({
              "width":"600px"
          });
      }
      if (location.href.indexOf('keylol.com') != -1) {
          this._beforeElement.before(this._$menu);
      } else {
          this._$textarea.before(this._$menu);
      }
    //设置显示图片用的div
    this._$faceDiv = $("</div><div id=faceContent style=clear:both></div>");
    this._$faceDiv.css({
      "border":"1px solid rgb(131,148,150)",
      "margin-top":"5px",
      "padding":"10px"
    });
      if ($textarea.attr("id") == "postmessage") {
          this._$faceDiv.css({
              "width":"580px"
          });
      }
    this._$menu.after(this._$faceDiv);
    //FaceSet对象的表,key是FaceSet的name,同时也是this._$menu显示的内容;
    //value则是对应的FaceSet对象
    this._faceSetTable = {};
    //当前显示的表情集合
    this._curFaceSet = null;
  }

   /* 显示debug用信息,参数可以多个,像console.log一样使用 */
  debugMsg(){
    if(this._showDebug) {
      console.log(...arguments);
    }
  }

  //往textarea插入文本
  _insertText(textInsert){
    //用数组选择方法把$对象变成一般document对象,访问其光标选择位置
    var pos = this._$textarea[0].selectionEnd;
    // 原文本
    var oldText = this._$textarea.val();
    // 插入完成后的新文本
    var newText = oldText.substr(0,pos)+textInsert+oldText.substr(pos)
    // 插入
    this._$textarea.val(newText);
  }

  //初始化菜单与表情table
  _initMenuAndFaces(){
    //再写入菜单需要的html,记录表情集合对象
    var menuHtml = "";
    for(var menuKey in this._faceTable){
      var srcList = this._faceTable[menuKey];
      var objFs = new FaceSet(menuKey,srcList,this._$faceDiv,this._showDebug);
      menuHtml += `<div class=faceSetDiv><a class=faceSet>${menuKey}</a></div>`;
      this._faceSetTable[menuKey] = objFs;
    }
    this._$menu.html(menuHtml);
    $('.faceSet').css({
       "font-size":"12px","margin":"20px","color":"#f2f2f2","cursor":"pointer"
    });
    $('.faceSetDiv').hover(
      function(event){
        if(event.target.className != 'faceSetDiv') return;
        $(event.target).css({"background-color":"rgb(64,166,228)"});
      },
      function(event){
        if(event.target.className != 'faceSetDiv') return;
        $(event.target).css({"background-color":"rgb(64,166,228)"});
      }
    );
    $('.faceSetDiv').css({
      "min-width":"40px","float":"left","background-color":"rgb(64,166,228)"
    });
  }

  /* 绑定所有事件,需要冒泡执行 */
  _addEvents(){
    //添加事件时,需要传入自己,所以要记住自己
    var obj = this;
    //点击菜单,只有点击了'faceSet'class才生效
    var menu = this._$menu[0];
    menu.addEventListener('click',function(e){
      var target = e.target;
      if(target.className != 'faceSet'){
        return;
      }
      //点击的文字
      var faceTag = target.textContent;
      //如果当前没有已显示图像集,显示;
      if(!obj._curFaceSet){
        obj._curFaceSet = obj._faceSetTable[faceTag];
        obj._curFaceSet.show();
      }else{
      //若点击的文字不是当前显示的表情集合,把原来的表情集隐藏,显示点击的;
      //否则隐藏当前表情集合.
        if(obj._curFaceSet.getName() == faceTag){
          obj._curFaceSet.hide();
          obj._curFaceSet = null;
        }else{
          obj._curFaceSet.hide();
          obj._curFaceSet = obj._faceSetTable[faceTag];
          obj._curFaceSet.show();
        }
      }
    });
    //点击图片
    var faceDiv = this._$faceDiv[0];
    faceDiv.addEventListener('click',function(e){
      var target = e.target;
      // 点击的不是'img',忽略
      if(target.tagName.toLowerCase() != 'img'){
        return;
      }
      var src = target.src;
      var textInsert = `[img]${src}[/img]`;
      obj._insertText(textInsert);
    });
  }

  main(){
    //生成menu与表情集合的具体内容
    this._initMenuAndFaces();
    //绑定事件
    this._addEvents();
  }
}

function _init_scirpt($textarea, beforeElement) {
    if ($textarea.length == 0) {
        return;
    }

    //这一句自定义表情包,注意有些图片可能省略了域名
    var faceTable = {
        "阿鲁":[
            'https://blob.keylol.com/forum/202005/10/193004ododeoeb74ooaw5a.png',
            'https://blob.keylol.com/forum/202005/10/194135dbljt3q0m3ulluxk.png',
            'https://blob.keylol.com/forum/202005/11/084043p1w2crnzvrsbrsv1.png',
            'https://blob.keylol.com/forum/202005/11/084043tpf44v69vuu39od9.png',
            'https://blob.keylol.com/forum/202005/11/084043nz3olularkx6aaao.png',
            'https://blob.keylol.com/forum/202005/11/084044ju4ocm4focsquizi.png',
            'https://blob.keylol.com/forum/202005/11/084044zastta6az30qc00q.png',
            'https://blob.keylol.com/forum/202005/11/084043zbnbor28nan6rvob.png',
            'https://blob.keylol.com/forum/202005/11/084043wl1zaf10lfpyvr0a.png',
            'https://blob.keylol.com/forum/202005/12/070831vs9zcv09ue8ahbyn.png',
            'https://blob.keylol.com/forum/202005/12/091146c4snkyannuu5cm4k.png',
            'https://blob.keylol.com/forum/202005/26/002419fi65hrvzfgim7cl6.png',
            'https://blob.keylol.com/forum/202005/10/201612mndzkzo9zebikeko.png',
            'https://blob.keylol.com/forum/202005/10/194351hizk85m602z6f8zf.png',
            'https://blob.keylol.com/forum/202005/10/205215y2twi2w3sfooi3i1.png',
            'https://blob.keylol.com/forum/202005/10/202306x370d0gii0xzz2d9.png',
            'https://blob.keylol.com/forum/202005/26/011934sdnlq814y70a0cu3.png',
            'https://blob.keylol.com/forum/202006/05/064734dfk6fdksmo3fn0cf.png',
            'https://blob.keylol.com/forum/202006/05/061448atijaoifwwrarewa.png',
            'https://blob.keylol.com/forum/202006/05/061448gspchccqxc5juj5r.png',
            'https://blob.keylol.com/forum/201905/22/183522vojrd4mrd77bb7g4.png',
            'https://blob.keylol.com/forum/202006/05/060154aqxr6vvseydrj0gx.png',
            'https://blob.keylol.com/forum/202006/05/060153beaakbeo4ozb6ybz.png',
            'https://blob.keylol.com/forum/202006/05/060154ad8pd5v84zamggl1.png',
            'https://blob.keylol.com/forum/202006/05/060155f03s42s4guphg1q3.png',
            'https://blob.keylol.com/forum/202006/05/060154dgn4geq1dnzxenpr.png',
            'https://blob.keylol.com/forum/202006/05/060155ue3ncffdyn3yeelt.png',
            'https://blob.keylol.com/forum/202006/05/060155f11ulzokfvtrybru.png',
            'https://blob.keylol.com/forum/202006/05/060154qrioi1dwc99nndno.png',
            'https://blob.keylol.com/forum/202006/05/060154cb52r2o4kf7hpkrr.png',
            'https://blob.keylol.com/forum/202006/12/152139bogvnwwt2x8wcstx.png',
            'https://blob.keylol.com/forum/202106/26/184309zcm10gkkcx0zgc44.jpg',
            'https://blob.keylol.com/forum/202106/26/184310y5vsm788nsag0ga8.jpg',
            'https://blob.keylol.com/forum/202106/26/184311vrtl05pzn9luc4zd.jpg',
            'https://blob.keylol.com/forum/202106/26/184312hxm60hzh0ijtnj0c.jpg',
            'https://blob.keylol.com/forum/202106/26/184313yh7e7hgjd22b2g03.jpg',
            'https://blob.keylol.com/forum/202106/26/184314mt4v13ahk55o1ath.jpg',
            'https://blob.keylol.com/forum/202106/26/184652halalq29u3l38ha9.jpg',
            'https://blob.keylol.com/forum/202106/26/184654asss63szjjgkcj6d.jpg',
            'https://blob.keylol.com/forum/202106/26/184655vglusjrg2irqzsle.jpg',
            'https://blob.keylol.com/forum/202106/26/184651fnhovdv1j1vd1inv.jpg',
            'https://blob.keylol.com/forum/202106/26/184653ikkq0jyujgts6jmi.jpg',
            'https://blob.keylol.com/forum/202106/26/184651v76rzw2pwrt6pupt.jpg',
            'https://blob.keylol.com/forum/202106/26/184654q992v7f59rrr798r.jpg',
            'https://blob.keylol.com/forum/202106/27/140303ovmpf1v6cjzrffwf.jpg',
            'https://blob.keylol.com/forum/202106/27/140259pqggeufeffxezzti.jpg',
            'https://blob.keylol.com/forum/202106/27/140300j89w3tvvtzv1znle.jpg',
            'https://blob.keylol.com/forum/202106/27/140302k8uf2a8dm4c5cdj5.jpg',
            'https://blob.keylol.com/forum/202106/27/140255hdiw1efr3v4hhsss.jpg',
            'https://blob.keylol.com/forum/202106/27/140258zeacjllaf4bfjw4j.jpg',
            'https://blob.keylol.com/forum/202106/27/140301ho5wr2re68exonn8.jpg',
            'https://blob.keylol.com/forum/202106/27/140256z41oezm0o8tqb1za.jpg',
            'https://blob.keylol.com/forum/202108/25/120430ijgksq8g8s8jkh8s.jpg',
            'https://blob.keylol.com/forum/202108/25/120429wj3atmkttszsagq2.jpg',
            'https://blob.keylol.com/forum/202108/25/120428h8zd1xddd2hx629u.jpg',
            'https://blob.keylol.com/forum/202108/25/120431bz1ai1yzsyf9gkk2.jpg',
            'https://blob.keylol.com/forum/202205/18/181121ina91yn29tas2avx.gif',
            'https://blob.keylol.com/forum/202205/18/181115oll7mi6aemggeu7l.gif',
        ],
        "阿鲁动图":[
            'https://blob.keylol.com/forum/202005/12/083257r2b1qbx96q463qee.gif',
            'https://blob.keylol.com/forum/202005/12/084847baa8zclm36288dmd.gif',
            'https://blob.keylol.com/forum/202005/12/085528vcdmiucvnwe1usig.gif',
            'https://blob.keylol.com/forum/202007/17/114656y33gjijzzr3t3q52.gif',
            'https://blob.keylol.com/forum/202007/17/122338s8q9hmq5qi89mmi9.gif',
            'https://blob.keylol.com/forum/202106/27/140256ifyyrxmppm9pczpp.gif',
            'https://blob.keylol.com/forum/202106/27/140257bi0ttmumymiib9bt.gif',
        ],
        "鲁家拳法👊":[
            'https://blob.keylol.com/forum/202005/25/213106ezdy91o4vdlaov24.gif',
            'https://blob.keylol.com/forum/202005/25/213135kgwvv4gi4i62r2r4.gif',
            'https://blob.keylol.com/forum/202005/25/213106rzjyjy7zvcjokk7b.gif',
            'https://blob.keylol.com/forum/202005/25/213109ub20e07yg81utxjt.gif',
            'https://blob.keylol.com/forum/202006/05/213911vxmm0d0zz831dux1.gif',
            'https://blob.keylol.com/forum/202006/05/213914ympuapzaktup7hbt.gif',
        ],
        "鲁家剑法🗡":[
            'https://blob.keylol.com/forum/202005/25/224154e8rzq66kselrzqaq.gif',
            'https://blob.keylol.com/forum/202006/03/062937pgzj6b8hug85pdgj.gif',
            'https://blob.keylol.com/forum/202005/25/234755sohreyea435eze5e.gif',
            'https://blob.keylol.com/forum/202006/03/062937vvvszz5mstxmm7sm.gif',
            'https://blob.keylol.com/forum/202006/07/075622njydyj0knd0ow31z.gif',
        ],
        "奇怪的嗷大喵🐱":[
            'https://blob.keylol.com/forum/202006/03/051752x9kv99v6jhpeuekd.gif',
            'https://blob.keylol.com/forum/202006/03/051752h6mq9lb8qqnd6cbx.gif',
            'https://blob.keylol.com/forum/202006/03/051752z9mxb5jcjvjcfpia.gif',
            'https://blob.keylol.com/forum/201603/29/193843bhkdkssbwdbwghow.gif',
            'https://blob.keylol.com/forum/202006/07/075623dernnzotekz245o5.gif',
            'https://blob.keylol.com/forum/201603/31/140216frq3mujgm7sm314g.gif',
            'https://blob.keylol.com/forum/201603/31/145148s1stbelg5bhbh0sw.gif',
            'https://blob.keylol.com/forum/202006/03/052001risv43insg3wnvj4.gif',
            'https://blob.keylol.com/forum/202006/03/062938t48zqg6jaiji2c3e.gif',
            'https://blob.keylol.com/forum/201802/25/161019d93ivxzqjk44cyj5.gif',
            'https://blob.keylol.com/forum/201802/25/161020f0w6q565hw252wv5.gif',
            'https://blob.keylol.com/forum/201802/25/164423wcmgx33fmgs33qgp.gif',
            'https://blob.keylol.com/forum/202006/03/062938d4ak64u4xooryuk4.gif',
            'https://blob.keylol.com/forum/201802/25/161019bfvor15hd1v3c3co.gif',
            'https://blob.keylol.com/forum/201802/25/164423wzwkddg8rlgj40ze.gif',
            'https://blob.keylol.com/forum/202006/24/170800kj5ilwppnnisspns.gif',
            'https://blob.keylol.com/forum/202206/24/205538i3656pvps5pn5pxh.gif',
        ],
        "大头版猫猫虫🐱":[
            'https://blob.keylol.com/forum/202112/23/162212kaji3qqgz4j7i1r8.gif',
            'https://blob.keylol.com/forum/202112/23/162237vrcihxx8tjzcjqci.gif',
            'https://blob.keylol.com/forum/202112/23/162213g45ue8keoxe1e97y.gif',
            'https://blob.keylol.com/forum/202112/23/162214rdt3d3vz6mmiijmz.gif',
            'https://blob.keylol.com/forum/202112/23/162215ctpwthlh9epw3rm9.gif',
            'https://blob.keylol.com/forum/202112/23/162216mdnac2o58ss5gk32.gif',
            'https://blob.keylol.com/forum/202112/23/162216n8drokb1oo78u7ko.gif',
            'https://blob.keylol.com/forum/202112/23/162217prexwu85c8guwdwq.gif',
            'https://blob.keylol.com/forum/202112/23/162218lglfgl4ym0zgejrg.gif',
            'https://blob.keylol.com/forum/202112/23/162219xhngqioipmitttim.gif',
            'https://blob.keylol.com/forum/202112/23/162219x23kb1shjg887jkk.gif',
            'https://blob.keylol.com/forum/202112/23/162220j676g1cvw680kcv5.gif',
            'https://blob.keylol.com/forum/202112/23/162221ml94hu7fppux70q9.gif',
            'https://blob.keylol.com/forum/202112/23/162222aszdmtw4sywq92q2.gif',
            'https://blob.keylol.com/forum/202112/23/162223nkppypocm2opzdj2.gif',
            'https://blob.keylol.com/forum/202112/23/162223u9w6zimwamfz86qa.gif',
            'https://blob.keylol.com/forum/202112/23/162224s99akamzn7hvzpvm.gif',
            'https://blob.keylol.com/forum/202112/23/162225a2qttsp10qhwzcvs.gif',
            'https://blob.keylol.com/forum/202112/23/162226b79716rd9v10h6r4.gif',
            'https://blob.keylol.com/forum/202112/23/162227qkmy623hm4jy2j3m.gif',
            'https://blob.keylol.com/forum/202112/23/162228onk6smn1pknu33ne.gif',
            'https://blob.keylol.com/forum/202112/23/162228tpmhq9h9gq4pmphu.gif',
            'https://blob.keylol.com/forum/202112/23/162229ifal6ktkzkl6kckl.gif',
            'https://blob.keylol.com/forum/202112/23/162230u0u02fkfkd7u7nfj.gif',
            'https://blob.keylol.com/forum/202112/23/162232i7yb90f6bj76b7bb.gif',
            'https://blob.keylol.com/forum/202112/23/170901nb1dlnn7ziv91udv.gif',
            'https://blob.keylol.com/forum/202112/23/170902wtedruprpwrutmep.gif',
            'https://blob.keylol.com/forum/202112/23/170903oi8o18euvb86ibz8.gif',
            'https://blob.keylol.com/forum/202112/23/170859j6vwlo7uh6uems7u.gif',
            'https://blob.keylol.com/forum/202112/23/170900q4x4mgdk548we877.gif',
            'https://blob.keylol.com/forum/202112/23/170900qq33tqymzff83dyf.gif',
            'https://blob.keylol.com/forum/202112/23/162233auss8jsjsd9f8c9j.gif',
            'https://blob.keylol.com/forum/202112/23/162231x27txhfxcx1xnd7b.gif',
            'https://blob.keylol.com/forum/202112/23/162233z613722pl7quqq82.gif',
            'https://blob.keylol.com/forum/202112/23/162234oz6it856p6zwpd2q.gif',
            'https://blob.keylol.com/forum/202112/23/162235ndpzgdbb3zgjrp3w.gif',
            'https://blob.keylol.com/forum/202112/23/162236xuxt6sdwwax8pew5.gif',
            'https://blob.keylol.com/forum/202112/23/162237dav44a307f0w3s39.gif',
        ],
        "文字版猫猫虫🐱":[
            'https://blob.keylol.com/forum/202112/23/172602wfhqwr39m33e981f.gif',
            'https://blob.keylol.com/forum/202112/23/172601c38nccun4nj98rz2.gif',
            'https://blob.keylol.com/forum/202112/23/172600vjemvnyyyllvnyem.gif',
            'https://blob.keylol.com/forum/202112/23/172559j0ltzzc1u41qvllq.gif',
            'https://blob.keylol.com/forum/202112/23/172558uck47jb6vv5cinci.gif',
            'https://blob.keylol.com/forum/202112/23/172557om2tc8vsgvrllssn.gif',
            'https://blob.keylol.com/forum/202112/23/172556yhd04xdg4dl0g9tp.gif',
            'https://blob.keylol.com/forum/202112/23/172555vywl1q0kothook00.gif',
            'https://blob.keylol.com/forum/202112/23/172554stupevlii5ewvw5o.gif',
            'https://blob.keylol.com/forum/202112/23/172553c7z6r77060w6cm86.gif',
            'https://blob.keylol.com/forum/202112/23/172553a3vpvujc8a88z5qr.gif',
            'https://blob.keylol.com/forum/202112/23/172552fbb0donp2v0qfcqu.gif',
            'https://blob.keylol.com/forum/202112/23/172551ll0uc1uscbslbccu.gif',
            'https://blob.keylol.com/forum/202112/23/172550tevldbd3qzzzv0e3.gif',
            'https://blob.keylol.com/forum/202112/23/172549iclwsv6avrjaxrwi.gif',
            'https://blob.keylol.com/forum/202112/23/172548jbam2pkpd71bm3j6.gif',
            'https://blob.keylol.com/forum/202112/23/172548b7cu8yi88il1iuim.gif',
            'https://blob.keylol.com/forum/202112/23/172546h1whw9dehxw3euz0.gif',
            'https://blob.keylol.com/forum/202112/23/172545gvlsyoyl8ps77yj1.gif',
            'https://blob.keylol.com/forum/202112/23/172544kxcxhyxnc7y68don.gif',
            'https://blob.keylol.com/forum/202112/23/172543opukomraofduk2ur.gif',
            'https://blob.keylol.com/forum/202112/23/172542x008626og1xy4li2.gif',
            'https://blob.keylol.com/forum/202112/23/172541dzwwwlkpgb58blaw.gif',
            'https://blob.keylol.com/forum/202112/23/172540u2g71pnqbibpgqj3.gif',
            'https://blob.keylol.com/forum/202112/23/172539qczcztoxttwqoqxp.gif',
            'https://blob.keylol.com/forum/202112/23/172538uttk23c3q5it0qzi.gif',
            'https://blob.keylol.com/forum/202112/23/172537t5rk0pakkhak1a5r.gif',
            'https://blob.keylol.com/forum/202112/23/172536bnzk518k5ll7ao2b.gif',
            'https://blob.keylol.com/forum/202112/23/172535jazgog3na0q37amn.gif',
            'https://blob.keylol.com/forum/202112/23/172534sq3z1q4s1qkzxkpi.gif',
            'https://blob.keylol.com/forum/202112/23/172533omgjuu94epzlruuu.gif',
            'https://blob.keylol.com/forum/202112/23/172533g2lq0l3hqla42xh3.gif',
            'https://blob.keylol.com/forum/202112/23/172532uxxag0wdwc29fiz9.gif',
            'https://blob.keylol.com/forum/202112/23/172531oxyxghszujwzevle.gif',
            'https://blob.keylol.com/forum/202112/23/172530wxoyysvijs0yquiq.gif',
            'https://blob.keylol.com/forum/202112/23/172529ph63054lqtglo56r.gif',
            'https://blob.keylol.com/forum/202112/23/172528jcy0bydbheb5qbsp.gif',
            'https://blob.keylol.com/forum/202112/23/172527zlt4k3b8e874bldh.gif',
            'https://blob.keylol.com/forum/202112/23/172526pssils1cbqqtr7r1.gif',
            'https://blob.keylol.com/forum/202112/23/172526ok4hbmpidryp0hqm.gif',
            'https://blob.keylol.com/forum/202112/23/172525v5kxy4k7qsxb42p2.gif',
            'https://blob.keylol.com/forum/202112/23/172524muu7auzuul85k2o5.gif',
            'https://blob.keylol.com/forum/202112/23/172523yavevvvixtnivfvz.gif',
            'https://blob.keylol.com/forum/202112/23/172522weguepgpojdc5v5o.gif',
            'https://blob.keylol.com/forum/202112/23/172521xsn06aqocllocen5.gif',
            'https://blob.keylol.com/forum/202112/23/172519m9stv5gmgfgcbehb.gif',
            'https://blob.keylol.com/forum/202112/23/172517uxoxvx6xd6441796.gif',
            'https://blob.keylol.com/forum/202112/23/172517dx8zvglrr38sgdk3.gif',
            'https://blob.keylol.com/forum/202112/23/172515lqwqwwgu7ohunkxo.gif',
            'https://blob.keylol.com/forum/202112/23/172514ugcfqr8qiji1jqdd.gif',
            'https://blob.keylol.com/forum/202112/23/172513rujamzdgusxcxgrn.gif',
            'https://blob.keylol.com/forum/202112/23/172512dx8rbaacagpgplvy.gif',
            'https://blob.keylol.com/forum/202112/23/172510fedw131m02b13wx2.gif',
            'https://blob.keylol.com/forum/202112/23/172509xemmnz23pifed2il.gif',
            'https://blob.keylol.com/forum/202112/23/172508ikaxxvrrjqxxxvzk.gif',
            'https://blob.keylol.com/forum/202112/23/172507qs2hho9u6nb246d0.gif',
            'https://blob.keylol.com/forum/202112/23/172506pjizzioyyn4zhonz.gif',
            'https://blob.keylol.com/forum/202112/23/172505i040anyxnyza0www.gif',
            'https://blob.keylol.com/forum/202112/23/172504dw06z5oj0gidmgm6.gif',
            'https://blob.keylol.com/forum/202112/23/172503c7xl1alag58t9x2u.gif',
            'https://blob.keylol.com/forum/202112/23/172503ofvrjatrrtvrrsz3.gif',
            'https://blob.keylol.com/forum/202112/23/172501ilcmvvfbilc9va9i.gif',
            'https://blob.keylol.com/forum/202112/23/172501r919mvfsfmlmn1lt.gif',
            'https://blob.keylol.com/forum/202112/23/172459omzvxxxvmm89v90z.gif',
            'https://blob.keylol.com/forum/202112/23/172458qwvtjvwvgdntjecj.gif',
            'https://blob.keylol.com/forum/202112/23/172457t12b2887wua8cll2.gif',
            'https://blob.keylol.com/forum/202112/23/172456f8ewm818w881o9ix.gif',
            'https://blob.keylol.com/forum/202112/23/172455udr305y5grepowe6.gif',
            'https://blob.keylol.com/forum/202112/23/172454y9nla246u2a68t94.gif',
            'https://blob.keylol.com/forum/202112/23/172453wr9rle9dg6th11fl.gif',
            'https://blob.keylol.com/forum/202112/23/172452xh4fbhtmokr7nsnh.gif',
            'https://blob.keylol.com/forum/202112/23/172450ldumeze0lkuesd7k.gif',
            'https://blob.keylol.com/forum/202112/23/172449ien18a9vh06to1m5.gif',
            'https://blob.keylol.com/forum/202112/23/172448js71nh97n7ttpf7c.gif',
            'https://blob.keylol.com/forum/202112/23/172447rvux07tz39jlda27.gif',
            'https://blob.keylol.com/forum/202112/23/172446t0yxn2ayotcy70qt.gif',
        ],
        "普通版猫猫虫🐱":[
            'https://blob.keylol.com/forum/202112/25/105308t4cop63eerc32ozp.gif',
            'https://blob.keylol.com/forum/202112/25/105309orvbrzfyj7jo4qjo.gif',
            'https://blob.keylol.com/forum/202112/25/105310ov4ro4zlo3oxqghq.gif',
            'https://blob.keylol.com/forum/202112/25/105311tu3w444nb2bxwg2u.gif',
            'https://blob.keylol.com/forum/202112/25/105312qdnd3v0uiwvwdiwu.gif',
            'https://blob.keylol.com/forum/202112/25/105312r68s8cok8vvf93ef.gif',
            'https://blob.keylol.com/forum/202112/25/105313up5tzfjaofk2loao.gif',
            'https://blob.keylol.com/forum/202112/25/105314kctmq2cq29ci8ica.gif',
            'https://blob.keylol.com/forum/202112/25/105315dvqd1zmu1muq1pmu.gif',
            'https://blob.keylol.com/forum/202112/25/105316qwjloj7d4zxwe4f2.gif',
            'https://blob.keylol.com/forum/202112/25/105317o48ir6i3irs3l9g9.gif',
            'https://blob.keylol.com/forum/202112/25/105318iifoaqba38d8ag5h.gif',
            'https://blob.keylol.com/forum/202112/25/105318h2opaq988wfm5z2p.gif',
            'https://blob.keylol.com/forum/202112/25/105319mwzplr62bp0wzuz5.gif',
            'https://blob.keylol.com/forum/202112/25/105320nioko7khid1nsp4h.gif',
            'https://blob.keylol.com/forum/202112/25/105321dtky0k1l996amfgt.gif',
            'https://blob.keylol.com/forum/202112/25/105322k66kxskk0asrm6jj.gif',
            'https://blob.keylol.com/forum/202112/25/105323lt5oxajoznz4uoji.gif',
            'https://blob.keylol.com/forum/202112/25/105324leinn474a3nuie7i.gif',
            'https://blob.keylol.com/forum/202112/25/105324i1uwzrs12z18czwc.gif',
            'https://blob.keylol.com/forum/202112/25/105325rgfd2wm6sxj81oxf.gif',
            'https://blob.keylol.com/forum/202112/25/105326yvrrvdl39129v0v0.gif',
            'https://blob.keylol.com/forum/202112/25/105327rh22827thslhcut3.gif',
            'https://blob.keylol.com/forum/202112/25/105328fki96wl1tlq9q9f1.gif',
            'https://blob.keylol.com/forum/202112/25/105329uh85sbmzuh8rf5hd.gif',
            'https://blob.keylol.com/forum/202112/25/105330emmdhgc68uxccbxb.gif',
            'https://blob.keylol.com/forum/202112/25/105330ahyw3tqazzzt5yrd.gif',
            'https://blob.keylol.com/forum/202112/25/105331fmweg7hmdzmmhppo.gif',
            'https://blob.keylol.com/forum/202112/25/105332fizio2l5o4fqz2o6.gif',
            'https://blob.keylol.com/forum/202112/25/105333muuhtqnr3r21n21r.gif',
            'https://blob.keylol.com/forum/202112/25/105334r26o6m4tn2tgsgy0.gif',
            'https://blob.keylol.com/forum/202112/25/105335lz9io50nnffypfbr.gif',
            'https://blob.keylol.com/forum/202112/25/105336ny3iuryen4uz5z3g.gif',
            'https://blob.keylol.com/forum/202112/25/105337v297hojvuoplo4v8.gif',
            'https://blob.keylol.com/forum/202112/25/105338ddddvhd7jjd7ni6w.gif',
            'https://blob.keylol.com/forum/202112/25/105339wticdwnyycz8uw6c.gif',
            'https://blob.keylol.com/forum/202112/25/105340q3zy8qcnpskccncn.gif',
            'https://blob.keylol.com/forum/202112/25/105341koukzowxau11zucz.gif',
            'https://blob.keylol.com/forum/202112/25/105342ztbzlx5vbunfbx5u.gif',
            'https://blob.keylol.com/forum/202112/25/105343sxm7mamt2wrm22zj.gif',
            'https://blob.keylol.com/forum/202112/25/105344aa9meel11imnh9la.gif',
            'https://blob.keylol.com/forum/202112/25/105344uguqebw6oa6b0l6g.gif',
            'https://blob.keylol.com/forum/202112/25/105345dd173me8d82xm3ez.gif',
            'https://blob.keylol.com/forum/202112/25/105346j7j0u246g4002034.gif',
            'https://blob.keylol.com/forum/202112/25/105347zh8h71j7b8a7j87w.gif',
            'https://blob.keylol.com/forum/202112/25/105348qwixxxlesssbz14x.gif',
            'https://blob.keylol.com/forum/202112/25/105349hf4j6jgnpnhanat8.gif',
            'https://blob.keylol.com/forum/202112/25/105349wzkiglqb5qqhkgc2.gif',
            'https://blob.keylol.com/forum/202112/25/105350v6hhogo6pz990xlh.gif',
            'https://blob.keylol.com/forum/202112/25/105351kfwro8qf72rb422g.gif',
            'https://blob.keylol.com/forum/202112/25/105352y8ty00y2y11tyfkb.gif',
            'https://blob.keylol.com/forum/202112/25/105353dkqfh4afkkkvrrs9.gif',
            'https://blob.keylol.com/forum/202112/25/105354tmt6r1trstht9vvm.gif',
            'https://blob.keylol.com/forum/202112/25/105355vf58vv9c25dushdf.gif',
            'https://blob.keylol.com/forum/202112/25/105357wotgi5yxrjajw66d.gif',
            'https://blob.keylol.com/forum/202112/25/105357ca6ai9dc5aw6d9cb.gif',
            'https://blob.keylol.com/forum/202112/25/105358wf66rosestszgc5m.gif',
            'https://blob.keylol.com/forum/202112/25/105359oxcxcacuy95z5g9g.gif',
            'https://blob.keylol.com/forum/202112/25/110432wl6hccejvy4be4do.gif',
            'https://blob.keylol.com/forum/202112/25/105400a3ftjqjuzh030he0.gif',
            'https://blob.keylol.com/forum/202112/25/105401bdfbg78s95st9ss0.gif',
            'https://blob.keylol.com/forum/202112/25/105402r5z6333mmonozz3o.gif',
            'https://blob.keylol.com/forum/202112/25/105404rrlw11lmmellwlzh.gif',
            'https://blob.keylol.com/forum/202112/25/105405dgfnx22e226s2xe2.gif',
            'https://blob.keylol.com/forum/202112/25/105405sfumifrk0t3oumf4.gif',
            'https://blob.keylol.com/forum/202112/25/105406l6jne63e68s3s2nz.gif',
            'https://blob.keylol.com/forum/202112/25/105407eg3gcxu3eh6ookne.gif',
            'https://blob.keylol.com/forum/202112/25/105408ozt75u2ioif5d5y5.gif',
            'https://blob.keylol.com/forum/202112/25/105409enon6j1jn5k1jo6z.gif',
            'https://blob.keylol.com/forum/202112/25/105410xxhq7qv6997ivmx3.gif',
            'https://blob.keylol.com/forum/202112/25/105410lubtozuma3z3muwh.gif',
            'https://blob.keylol.com/forum/202112/25/105411s7vld1dl9ddoddel.gif',
            'https://blob.keylol.com/forum/202112/25/105412qcm4vs0xv4c7xtgs.gif',
            'https://blob.keylol.com/forum/202112/25/105413yd9qfqc9j87wzchb.gif',
            'https://blob.keylol.com/forum/202112/25/105414o9t3uizleseu5q4t.gif',
            'https://blob.keylol.com/forum/202112/25/105414oya5kneh6zdwjaaw.gif',
        ],
        "其乐咕咕🕊️":[
            'https://blob.keylol.com/forum/202006/12/152713rfkwwh6wbwhhrdwr.gif',
            'https://blob.keylol.com/forum/202006/12/152714xmonidliq2ndwntl.gif',
            'https://blob.keylol.com/forum/202006/12/152714gqg3ghmm1hqbgyep.gif',
            'https://blob.keylol.com/forum/202006/12/152715w1pzd71halkyd8l7.gif',
            'https://blob.keylol.com/forum/202006/12/152715gytx4szr0zr33urt.gif',
            'https://blob.keylol.com/forum/202006/12/152716gipiscpsxlwumit2.gif',
            'https://blob.keylol.com/forum/202006/12/152715rkh9tl68l366uv34.gif',
            'https://blob.keylol.com/forum/202006/12/152716jo649r8t0z0r8z94.gif',
            'https://blob.keylol.com/forum/202006/12/152716l0ppqth0oolli0oi.gif',
            'https://blob.keylol.com/forum/202006/12/152716fn1441ceulhuz6wu.gif',
            'https://blob.keylol.com/forum/202007/15/185758e08cccuyz1jiy0x0.gif',
            'https://blob.keylol.com/forum/202007/15/185759fo5zbif9uoo35rbb.gif',
            'https://blob.keylol.com/forum/202007/15/185750bcf5fp9cjgzy6ggf.gif',
            'https://blob.keylol.com/forum/202007/15/185754hwiyrt8kdj8ti0t6.gif',
            'https://blob.keylol.com/forum/202007/15/185759yxjb8k8j80ozfsjv.gif',
            'https://blob.keylol.com/forum/202007/15/185801qdia95k75dlty225.gif',
            'https://blob.keylol.com/forum/202007/15/185800ad5vszryyx3vra4k.gif',
            'https://blob.keylol.com/forum/202007/15/185800tvn3akllevpk6pe6.gif',
            'https://blob.keylol.com/forum/202007/15/215010tjdfrw8igjtjgajg.gif',
            'https://blob.keylol.com/forum/202007/15/185802a757xnyxogn58xzy.gif',
        ],
        "暂时下线的人来疯（好像没机会上线了🙃）":[
            'https://blob.keylol.com/forum/202007/15/190740hdp9bqljdnuhakak.gif',
            'https://blob.keylol.com/forum/202007/15/190740gc2izdci4wd24pcd.gif',
            'https://blob.keylol.com/forum/202007/15/190740ri69vihcqrqvpr9h.gif',
            'https://blob.keylol.com/forum/202007/15/190740cjqgtqptthogn2gt.gif',
            'https://blob.keylol.com/forum/202007/15/190740i9fd67vxd95d5d9v.gif',
            'https://blob.keylol.com/forum/202007/15/190740uzc0yiqq5qqy00qc.gif',
            'https://blob.keylol.com/forum/202007/15/190740wmr5mjplj77qd110.gif',
            'https://blob.keylol.com/forum/202007/15/190740m9w0499fif0e234v.gif',
            'https://blob.keylol.com/forum/202007/15/190741qyjclxlu7leyzq7u.gif',
            'https://blob.keylol.com/forum/202007/15/190741bff7u5kgubkttmdd.gif',
            'https://blob.keylol.com/forum/202007/15/190741xf9q9cr6mrddqqaz.gif',
            'https://blob.keylol.com/forum/202007/15/190741dwqy6fi6bbt7fbff.gif',
            'https://blob.keylol.com/forum/202007/15/190741mtt4vg4svdtyybeu.gif',
            'https://blob.keylol.com/forum/202007/15/190741lfxeno4odfydazwo.gif',
            'https://blob.keylol.com/forum/202007/15/190741htgvsiebriue2oei.gif',
        ],
        "茸茸康复计划（大佬快更新啊🤣）":[
            'https://blob.keylol.com/forum/202006/27/220408kyybyytl27bkye81.gif',
            'https://blob.keylol.com/forum/202006/27/220407wzigi7qy9i9ui5jj.gif',
            'https://blob.keylol.com/forum/202006/27/220408pq6m7718jmeswzem.gif',
            'https://blob.keylol.com/forum/202006/27/220415qotj55gsggsughug.gif',
            'https://blob.keylol.com/forum/202006/27/220408c3y77xsd0zl93993.gif',
            'https://blob.keylol.com/forum/202007/18/211318sppxvyvpy7phjiim.gif',
            'https://blob.keylol.com/forum/202007/18/211337x0kq2cexx2teq252.gif',
            'https://blob.keylol.com/forum/202007/18/211348wzulq0ju8a2y0aa9.gif',
            'https://blob.keylol.com/forum/202007/18/211359vyyyy9xev9ky1xk5.gif',
            'https://blob.keylol.com/forum/202007/18/211406rw5s375rddqhq8sw.gif',
            'https://blob.keylol.com/forum/202007/18/213348awih8bcetovuch88.gif',
            'https://blob.keylol.com/forum/202007/18/211330dzgolpphp0grilgk.gif',
            'https://blob.keylol.com/forum/202007/18/211359tqh3s39ewzh4etsz.gif',
            'https://blob.keylol.com/forum/202007/18/211330d9e5krmrhrptnorx.gif',
            'https://blob.keylol.com/forum/202007/18/211324tuljvhpzajghnj6z.gif',
            'https://blob.keylol.com/forum/202007/18/211330wexadaz5dzsbg1d0.gif',
            'https://blob.keylol.com/forum/202007/18/211336k56gnv1n5a1zfnde.gif',
            'https://blob.keylol.com/forum/202007/18/211331pwznlyok6p7y5oci.gif',
        ],
        "嘿嘿….🤤fufu…嘿嘿🤤🤤":[
            'https://blob.keylol.com/forum/202204/20/231258fqyvsscfpqvqpssq.gif',
            'https://blob.keylol.com/forum/202204/20/234436bzsvq8gqq2vf8tls.gif',
            'https://blob.keylol.com/forum/202204/20/234437vc55o55opdhepopz.gif',
            'https://blob.keylol.com/forum/202204/20/234438xilme579ixejqquk.gif',
            'https://blob.keylol.com/forum/202204/20/234438u78iiobaj6ivzgap.gif',
            'https://blob.keylol.com/forum/202204/20/234440lwnlon2tdn202wnn.gif',
            'https://blob.keylol.com/forum/202204/20/234440ksgx77gl3tystqlr.gif',
            'https://blob.keylol.com/forum/202204/20/234441f13cfe1a1j1rdho1.gif',
            'https://blob.keylol.com/forum/202204/20/234442a7dse8b828nbxu8e.gif',
            'https://blob.keylol.com/forum/202206/29/060405t3tcaf0i3i89ioia.gif',
            'https://blob.keylol.com/forum/202206/29/060405e9zqdnj0nijzkkmx.gif',
            'https://blob.keylol.com/forum/202206/29/060406a3qwvhwdkdyhvqyw.gif',
            'https://blob.keylol.com/forum/202206/29/060407ingnr7fs679vz9xz.gif',
            'https://blob.keylol.com/forum/202206/29/060407i34j2wjuffuo28uy.gif',
            'https://blob.keylol.com/forum/202206/29/060408ui9g5ne3xevpgodg.gif',
            'https://blob.keylol.com/forum/202206/29/060409rr3iix188w9mmz9t.gif',
            'https://blob.keylol.com/forum/202206/29/060409akoftk5boe5o55ef.gif',
            'https://blob.keylol.com/forum/202206/29/060410fzxx7cvikckl3lxu.gif',
            'https://blob.keylol.com/forum/202206/29/060411dsv3ry4yvo3mmlro.gif',
            'https://blob.keylol.com/forum/202206/29/060412ytwaw1ttwazkppls.gif',
            'https://blob.keylol.com/forum/202206/29/060412ntvta09zaccsuys0.gif',
            'https://blob.keylol.com/forum/202206/29/060413topmmpj4mhwppx2w.gif',
            'https://blob.keylol.com/forum/202206/29/060414d78j43nn92j39nkn.gif',
            'https://blob.keylol.com/forum/202206/29/060414q1jmgksj9khf8mts.gif',
            'https://blob.keylol.com/forum/202206/29/060415xuu82dd08d3q0i5n.gif',
            'https://blob.keylol.com/forum/202206/29/060416l3xjnhx4hr4p4r7i.gif',
            'https://blob.keylol.com/forum/202206/29/060416jltuzkch5q0z0htu.gif',
            'https://blob.keylol.com/forum/202206/29/060417c48pypzfy4ep6p7e.gif',
            'https://blob.keylol.com/forum/202206/29/060418lewz6lm26rqqsmue.gif',
            'https://blob.keylol.com/forum/202206/29/060418xhfjn0rr09sissm0.gif',
            'https://blob.keylol.com/forum/202206/29/060419pzpluoujzpa5jjry.gif',
            'https://blob.keylol.com/forum/202206/29/060420rc9zz29dffxdc19u.gif',
            'https://blob.keylol.com/forum/202206/29/060421ev6vpitbrpr6v7bb.gif',
            'https://blob.keylol.com/forum/202206/29/060421khiwktfkhhrb8kwt.gif',
            'https://blob.keylol.com/forum/202206/29/060422nnl3xgc0nekpxnp7.gif',
            'https://blob.keylol.com/forum/202206/29/060423xvqaqa2yvzvqef9z.gif',
            'https://blob.keylol.com/forum/202206/29/060423elignghr17tu7nqn.gif',
            'https://blob.keylol.com/forum/202206/29/060424dz553zqqb3isb204.gif',
            'https://blob.keylol.com/forum/202206/29/060425v8hz08ab2f88p408.gif',
            'https://blob.keylol.com/forum/202206/29/060425ro1o1tzucvlyrop5.gif',
            'https://blob.keylol.com/forum/202206/29/060426ifww8z6q6yuwnswo.gif',
            'https://blob.keylol.com/forum/202206/29/060427uypiobv0fzqixzcf.gif',
            'https://blob.keylol.com/forum/202206/29/060427i96dedzselsn9ed7.gif',
            'https://blob.keylol.com/forum/202206/29/060428skdqppzfkdde8v8v.gif',
            'https://blob.keylol.com/forum/202206/29/060429x2nlmmw6shrw0qaa.gif',
            'https://blob.keylol.com/forum/202206/29/064103d96pbvxihjhiibpo.gif',
            'https://blob.keylol.com/forum/202206/29/064104rcccj0710u1f2i12.gif',
            'https://blob.keylol.com/forum/202206/29/064104r4m477k45om88848.gif',
            'https://blob.keylol.com/forum/202206/29/064105hr6tvgygoyas9a9y.gif',
            'https://blob.keylol.com/forum/202206/29/064106mtmj8nmwn8ojm4zp.gif',
            'https://blob.keylol.com/forum/202206/29/064107b9yy52ytyw69hihw.gif',
            'https://blob.keylol.com/forum/202206/29/064107kmpiiop8qqqqn3mp.gif',
            'https://blob.keylol.com/forum/202206/29/064109zimzes5izqiiheh5.gif',
            'https://blob.keylol.com/forum/202206/29/064110h5norgaaosqqo2ji.gif',
            'https://blob.keylol.com/forum/202206/29/064110xapaszpa8o7z8jso.gif',
            'https://blob.keylol.com/forum/202206/29/064111euyv3e4yyioaxye0.gif',
            'https://blob.keylol.com/forum/202206/29/064112emk9vzzfa9y2a202.gif',
            'https://blob.keylol.com/forum/202206/29/064113pn1op1bb3snbeba7.gif',
            'https://blob.keylol.com/forum/202206/29/064114hkr0kjzlmnlmnmjz.gif',
            'https://blob.keylol.com/forum/202206/29/064115olc41llh1zlh2h7v.gif',
            'https://blob.keylol.com/forum/202206/29/064116q3g25rqrtquu9jz2.gif',
            'https://blob.keylol.com/forum/202206/29/064117kvyuwtr32uuo1mzq.gif',
            'https://blob.keylol.com/forum/202206/29/064117krgsom7rzkxmskrs.gif',
            'https://blob.keylol.com/forum/202206/29/064118y8ia4qe8ac6az9gg.gif',
            'https://blob.keylol.com/forum/202206/29/064119pjk34iddkll729bq.gif',
            'https://blob.keylol.com/forum/202206/29/064120o7vi791cwykngzgn.gif',
            'https://blob.keylol.com/forum/202206/29/064120cx0bbdzgs50cbm0g.gif',
            'https://blob.keylol.com/forum/202206/29/064121pselh0xpf6prpfuz.gif',
            'https://blob.keylol.com/forum/202206/29/064122yf85ee7wrfrzsfre.gif',
            'https://blob.keylol.com/forum/202206/29/064123hmawzlk3kjdp3ria.gif',
            'https://blob.keylol.com/forum/202206/29/064123rpowwqq5ufpp5b9m.gif',
            'https://blob.keylol.com/forum/202206/29/064125sgigb75n64rp4y2r.gif',
            'https://blob.keylol.com/forum/202206/29/064126ew55odxuekzw0kzf.gif',
        ],
        "管理员/版主の认可👍（收集中）":[
            'https://blob.keylol.com/forum/202206/29/074646ixv1rbb1hg1prbzh.gif',
            'https://blob.keylol.com/forum/202206/29/074647ldmwfwht1fmyax9m.gif',
            'https://blob.keylol.com/forum/202207/01/135654xvsnzznvh3k6d6nf.gif',
        ],
        "各种粉枪🐱":[
            'https://blob.keylol.com/forum/202207/01/125615e1a6kg69dwoa6je0.gif',
            'https://blob.keylol.com/forum/202207/01/125616fb39nnibi3rnbbmt.gif',
            'https://blob.keylol.com/forum/202207/01/125617tmj7n2r9acacni0i.gif',
            'https://blob.keylol.com/forum/202207/01/125618mrtsx4p6snotenen.gif',
            'https://blob.keylol.com/forum/202207/01/125619f1fwqh7cee7exqac.gif',
            'https://blob.keylol.com/forum/202207/01/125620olfc6wl9li6wjlzf.gif',
            'https://blob.keylol.com/forum/202207/01/125621o5110h3m2350t4t4.gif',
            'https://blob.keylol.com/forum/202207/01/125622or4uzbbtltbnbub6.gif',
            'https://blob.keylol.com/forum/202207/01/125623ld6dp702sz6p07aa.gif',
            'https://blob.keylol.com/forum/202207/01/125624a6cyyvvq8p6ndgpw.gif',
            'https://blob.keylol.com/forum/202207/01/125626xffilws3d630zhiy.gif',
            'https://blob.keylol.com/forum/202207/01/131803hoqilgsr239rq33v.gif',
        ],
    };

    // 新建表情包插件,运行main()方法
    var showDebug = false;
    var plugin = new SetycyasFacePlugin($textarea,faceTable,showDebug,beforeElement);
    plugin.main();
}

var reply_display = false;
var exec_script = false;

/** 执行代码,如无必要,不要修改FaceSet与SetycyasPlugin两个类.
 * 在这里修改执行代码,应该足够对应不同论坛的设定以及自定义表情.
 */
(function(){
    //这一句指定文本框,应对不同论坛请修改这里
    var $textarea = $("form[name=FORM] textarea[name=atc_content]");
    if ($textarea.length == 0) {
        $textarea = $("#fastpostmessage");
    }
    _init_scirpt($textarea, $("#fastpostreturn"));

    var tmpInterval = setInterval(function(){
        if (document.querySelector("#fwin_reply") != null) {
            reply_display = true;
            if (!exec_script) {
                exec_script = true;
                _init_scirpt($("#postmessage"), $("#postmessage").closest("div.tedt"));
            }
        } else {
            reply_display = false;
            if (exec_script) {
                exec_script = false;
                //console.log("close 1");
            }
        }
    }, 1000);
})();
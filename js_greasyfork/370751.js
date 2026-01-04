// ==UserScript==
// @name              Guardian Mistress Wiki
// @description       守护者情人 wiki 辅助脚本
// @author            极品小猫
// @namespace
// @icon
// @version           1.0.2
// @include			http://gwiki.jp/mistress/*
// @include     http://iwiki.jp/mistress/*
// @include     http*://wikiwiki.jp/ga-misu/*
// @require			http://code.jquery.com/jquery-2.1.4.min.js
// @icon        http://wikiwiki.jp/common/user-favicon.ico
// @icon        https://wikiwiki.jp/common/user-favicon.ico?v=2
// @grant 			unsafeWindow
// @grant       GM_addStyle
// @grant           GM_setClipboard
// @run-at			document-idle
// @namespace https://greasyfork.org/users/3128
// @downloadURL https://update.greasyfork.org/scripts/370751/Guardian%20Mistress%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/370751/Guardian%20Mistress%20Wiki.meta.js
// ==/UserScript==

var inserDataPosition=$('.full_hr, .title');        //插入位置
var DataResource='#body .style_table';     //数据来源
$('form[action="/ga-misu/"]').submit(function(){
  var select=$('input[name="word"]')
  select.focus();
  if(select.val()=="") document.execCommand('paste');
  select.val(select.val().replace(/\d+/g,''));
});

  var Data={ //数据缓存
    info : {
      'lv1':{},
      'lvMAX':{},
      'MASTER':{}
    },
    Skill : {
      '心醉':{},
      'MASTER':{},
      '超训练':{},
      '活动训练':{},
      '教练训练':{}
    }
  };
  var GM={
    FindInfo : function(Note, KEY, index, callback){//选择器，Data缓存节点，Key=属性, index=值索引
      if(KEY=='SPD'&&index==3) {
        var SPDv3=$(DataResource+' tr:contains('+KEY+')>:nth-child('+index+')');
        if(SPDv3.length==0) index=2;//如果不存在第二个SPD数据，则使用第一个
        else index=3;
      }
      var selection=DataResource+' tr:contains('+KEY+')>:nth-child('+index+')';
      var target=$(selection)[0], val=$(target).text();
      Data['info'][Note][KEY]=val;	//初始化子键值数据为JSON
      if(callback) val=callback(val);
      $('#info').append($('<td>').text(val));
    },
    FindSkill : function(Note, KEY, index, noKEY){
      if(KEY=='心酔') {
        var target=$(DataResource+' tr:contains('+KEY+')>:nth-child('+index+')');
        console.log(KEY, target.length, target);
        for(i=0, max=target.length;i<max;i++){
          var val=$(target[i]).text();
          Data['Skill'][Note][Note+i]=val;	//初始化子键值数据为JSON
          $('#Skill').append($('<td>').text(val));
        }
        var space=4-target.length;
        for(i=0;i<space;i++) $('#Skill').append($('<td>').text(''));
      } else if(KEY=='Ex'||KEY=='ＥＸ'||KEY=='Ｅｘ') {
        var target=$(DataResource+' tr:contains('+KEY+')');
        console.log(KEY, target.length, target);
        for(i=target.length==4?1:0, max=target.length;i<max;i++){//如果页面上有 Ex100 级别信息，则从后面开始计算
          var t=target[i].children.length>2?1:0;//第一条信息中有标题，需跳过（イクシード）
          var ExLv=$(target[i]).find(':nth-child('+(t+1)+')').text().replace(/[^\d]+(\d+)/,'$1');
            console.log(ExLv)
          var ExVal=$(target[i]).find(':nth-child('+(t+2)+')').text();
          Data['Skill'][Note][Note+i]={'Lv':'EX'+ExLv,'Val':ExVal};	//初始化子键值数据为JSON
          $('#Skill').append($('<td>').text('EX'+ExLv), $('<td>').text(ExVal));
        }
      } else {
        var target=$(DataResource+' tr:not(:contains(イベントで)):not(:contains(イベントドロップ)):contains('+KEY+')');
        console.log(KEY, target.length, target);
        for(i=target.length==4?1:0, max=target.length;i<max;i++){//如果页面上有 Ex100 级别信息，则从后面开始计算
          var t=target[i].children.length>2?1:0;//第一条信息中有标题，需跳过
          var ExLv=$(target[i]).find(':nth-child('+(t+1)+')').text();
          var ExVal=$(target[i]).find(':nth-child('+(t+2)+')').text();
          Data['Skill'][Note][Note+i]={'Lv':ExLv,'Val':ExVal};	//初始化子键值数据为JSON
          $('#Skill').append($('<td>').text(ExVal));
        }
      }
    },
    init:function(){
        var selection=function(){
            window.getSelection().selectAllChildren(this);
            GM_setClipboard(window.getSelection().toString(this).replace(' ','\t').trim());
        };
      //创建表格，//插入的数据位置
      $('<table id="newInfo" border="1" cellspacing="0" cellpadding="1"><tr id="info"></tr></table>').click(selection).insertAfter(inserDataPosition);
      $('<table id="newSkill" border="1" cellspacing="0" cellpadding="1"><tr id="Skill"></tr></table>').click(selection).insertAfter(inserDataPosition);
        $(DataResource+' tr:contains(ACTION)').next().click(selection);
        $(DataResource+' tr:contains(ACTION)').next().next().click(selection);
        $(DataResource+' tr:contains(必殺技)').next().click(selection);
        $(DataResource+' tr:contains(必殺技)').next().next().click(selection);

      var HAD=['HP','ATK','DEF'];
      this.FindInfo('lv1','cost', 2);
      for(var i in HAD) this.FindInfo('lv1',HAD[i], 2);

      //LvMax 信息提取
      if($(DataResource+' tr:contains(lvMAX)>:nth-child(2)').length>0) {
        this.FindInfo('lvMAX', 'lvMAX', 2, function(e){
          return e.match(/\d+|xx/).toString();
        });
      } else {
        this.FindInfo('lvMAX', 'lv99', 2, function(e){
          return e.match(/\d+/).toString();
        });
      }
      for(var i in HAD) this.FindInfo('lvMAX',HAD[i], 3);
      this.FindInfo('lvMAX','SPD', 2);
      //Master 信息
      this.FindInfo('MASTER','cost', 3);
      for(var i in HAD) this.FindInfo('MASTER',HAD[i], 4);
      this.FindInfo('MASTER','SPD', 3);

      //$('#info').append($('<td>').text(Data['info']['lv1']['cost']), $('<td>').text(Data['info']['lv1']['HP']), $('<td>').text(Data['info']['lv1']['ATK']), $('<td>').text(Data['info']['lv1']['DEF']));
      //$('#info').append($('<td>').text(Data['info']['lvMAX']['lvMAX']), $('<td>').text(Data['info']['lvMAX']['HP']), $('<td>').text(Data['info']['lvMAX']['ATK']), $('<td>').text(Data['info']['lvMAX']['DEF']), $('<td>').text(Data['info']['lvMAX']['SPD']));
      //$('#info').append($('<td>').text(Data['info']['MASTER']['cost']), $('<td>').text(Data['info']['MASTER']['HP']), $('<td>').text(Data['info']['MASTER']['ATK']), $('<td>').text(Data['info']['MASTER']['DEF']), $('<td>').text(Data['info']['MASTER']['SPD']));

      this.FindSkill('心醉', '心酔', 2);
      this.FindSkill('MASTER', 'Ex');
      this.FindSkill('MASTER', 'Ｅｘ');
      this.FindSkill('MASTER', 'ＥＸ');
      this.FindSkill('超训练', '超トレ', 2);
      if($(DataResource+' tr:contains(追加):not(:contains(追加効果))>:nth-child(2)').length>0) this.FindSkill('教练训练', '追加', 2);
      else this.FindSkill('教练训练', 'アドバイス', 2); //与 追加 同
        this.FindSkill('活动训练', 'イベント', 2);
    }
  }
  GM.init();
  console.log(Data);
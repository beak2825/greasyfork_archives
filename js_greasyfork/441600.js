// ==UserScript==
/*
远程调用代码 ：  	https://greasyfork.org/scripts/441600-jk/code/jk.user.js
php <script src="https://greasyfork.org/scripts/441600-jk/code/jk.user.js<?php echo "?v=".rand(1,10000);?>"></script>
js:
     var url='https://greasyfork.org/scripts/441600-jk/code/jk.user.js';
     el=document.createElement('script');
     el.src=url+'?rnd='+Math.random();
     document.getElementsByTagName("head")[0].appendChild(el); 
*/
//  
// @name            jk
// @namespace       moe.canfire.flf

// @description     jk库(js常用 es6)
// @author          mengzonefire
// @license         MIT
// @match           *
 
// @resource jquery         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// ==/UserScript==
 
//找不到函数定义的解决方法
/*
不要用 function test(){};
而要： "use strict";
test=function(){ };或 String.test=function(){}; 
*/
//=====================================
var help=`
/*
1.选择器函数，selall,sel,特快专递   var emlist=jfunc.selall('.div');  for(var e in ems)
2.jstr成员函数getBefore,getAfter,getBetween0,getBetweenList
  contains,newRegExp,substrCount
  //jstr.getBefore,getAfter,getBetween0,getBetweenList,substrCount,contains,excelTable2json
3.jstorage.getstr,setstr,getjon,setjson
4.jnode.成员函数，节点操作
  jnode.addNew,jnode.remove,
  jnode.addScript,addStyle,addScreenMask,addDiv,
5.jwidget小部件，包括jmask,jloading,jtoast, jdialog,jinputdialog,jconfirmdialog,jmsgdialog
jtoast.show("aa",1000);jtoast.close();
jloading.show('cv', 'waiting',3000);jloading.close();
jinputdialog.show('fsf','注意','请输入：','默认值','250px','auto',function(btncaption,inputvalue){
   alert(btncaption+'  '+inputvalue);
});
jconfirmdialog.show('uid','caption','confirm<br>Text?','250px','auto',function(btncaption){
   alert(btncaption);
});
jmsgdialog.show('uid','caption','confirm<br>Text?','250px','auto');
jmsgdialog.show('uid','caption','<div align="center">confirm<br>Text?</div>','250px','auto');
jmask.show(''); jmask.close();
*/ 
`
console.log(help)
//=====================================

window.sels=function(Selector){
	return document.querySelectorAll(Selector);
 };
window.sel=function(Selector){
	return document.querySelectorAll(Selector)[0];
 };
window.isValid=function(data_notnull_undefined){
  if( (data_notnull_undefined==null)||(data_notnull_undefined==undefined) ) return true;
   return false;
};
window.isEmpty=function (val) {
    return !(!!val ? typeof val === 'object' ? Array.isArray(val) ? !!val.length : !!Object.keys(val).length : true : false);
};
window.rndBetween=function(min, max) {
    //  m<=x<=n
    var range = max - min;
    var rand = Math.random();
    var randGrow = Math.round(rand * range); //四舍五入
    return min+randGrow;
};
//jstorage.getstr,setstr,getjon,setjson
var jstorage={
 setstr:function(name,str){
   return window.localStorage.setItem(name,str);
},
 getstr:function(name){
   return window.localStorage.getItem(name);
},
 setjson:function (name,json_arr){
   var jsonStr = JSON.stringify(json_arr);
   window.localStorage.setItem(name,jsonStr);
},
 getjson:function (name,json_arr){
   var jsonStr=window.localStorage.getItem(name);
   return JSON.parse( jsonStr );
},
};
//jstr.getBefore,getAfter,getBetween0,getBetweenList,substrCount,contains,excelTable2json
var jstr={
replaceAll:function(source,regExpStr,replaceStr){
 return source.replace(new RegExp(regExpStr,"gm"),replaceStr );
},

 getBefore:function(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return '';
  return sourcestr.substr(0,p);
},
getAfter:function(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return sourcestr;
  return sourcestr.substr(p+str.length);
},
getBetween0:function(fullstr,str1,str2){//注意转义问题
  return this.getBefore(this.getAfter(fullstr,str1)+str2,str2);
},
getBetweenList:function(fullstr,strBegin2,strEnd2){//返回一个数组
 var regstr=strBegin2+"(((?!"+strBegin2+").)*)"+strEnd2;
 var rx=new RegExp( regstr, 'gm');
 var result=[];
 var data;
 while( ( data= rx.exec( fullstr ) )!= null){	result.push(data[1]);}
  return result;
},
substrCount:function(sourcstr,substr) { //sourcstr 源字符串 substr特殊字符
     var count=0;
     while(sourcstr.indexOf(substr) != -1 ) {
        sourcstr = sourcstr.replace(substr,"")
        count++;
     }
     return count;
},
contains(fullstr,findstr){
  return (fullstr.indexOf(findstr)!=-1)?true:false;
},
excelTable2json:function(excelTableText,commaNames,keycolid){
//excel复制过来的转为json 行分隔符是换行或分号，列分隔符是制表符或逗号
    /*
   var txt=`
1	1905400127	袁子奕
2	1905400126	杨蓉
`;
var json=excelTable2json(txt,'no,stuno,stuname',1);
//结果
{
 "1905400127":{no:1,stuno:1905400127,stuname:"袁子奕"},
 "1905400126":{no:1,stuno:1905400126,stuname:"杨蓉"}
}
    */
  var names=commaNames.split(',');
  var rows= excelTableText.trim().split(/[;\n]/);//分行，换行符或分号
    var jsonstr='';
  for(var i in rows){
      var cols=rows[i].split(/[,\t]/);//分列，制表符或逗号
       var tmpstr='';
      for( var j in cols){
          tmpstr=tmpstr+`,"${names[j]}":"${cols[j]}"`;
      }
      jsonstr=jsonstr+`,\r\n"${cols[keycolid]}":{ ${tmpstr.substring(1)} }`;
  };
    jsonstr="{"+jsonstr.substring(1)+"\r\n}";
     console.log(jsonstr);
    var json=(new Function("", "return " + jsonstr ))();
    return json;
},//---------------------------
newRegExp:function (regstr_spashMustDouble,igm){//正则的特殊字符串处理
       //// a.replace( myRegExp("ax\zff", "gm"), s2); //直接使用字符串，自动处理需要转义的字符；
	 var charlist='$*+.?\\^|(){}[]'.split(""); //\\只是代表\字符；
	 for(var kid in charlist){
	     regstr_spashMustDouble=regstr_spashMustDouble.replace( charlist[kid],"\\"+charlist[kid]);
	 }
 	 return new RegExp(regstr_spashMustDouble,igm);
	  /*
	  //正则表达式，
	  //第1步，检查其中本身有没有\,如果有，必须改成\\,否则\这字符会自动少掉；
	  //第2步，对元字符要加转义前加\
           
	   */
}  
}//jstr

jnode={
 addNew:function(uid,tag){
    var el=document.querySelector("#"+uid) ;  
    if( (el!=undefined)&&(el!=null)  ){el.parentNode.removeChild(el);};
     el=document.createElement(tag);el.id=uid;
     return el;
},
  remove:function(uid_or_elementObj){//id 或 element
    if(typeof(uid_or_elementObj)=='string') var el=document.querySelector("#"+uid_or_elementObj) ;  
    else var el=uid_or_elementObj;
    if( (el!=undefined)&&(el!=null)  ){el.parentNode.removeChild(el);};
},
addScript:function(uid,url){
    var el=addNew(id,'script');  
    el.type='text/javascript';el.src=url+'?rnd='+Math.random();
    document.getElementsByTagName("head")[0].appendChild(el); 
},
addStyle:function(uid,css){
	var el=addNew(uid,"style");
    el.innerHTML=css;
    document.getElementsByTagName("head")[0].appendChild(el); 
},
addDiv:function(uid,Tag){
	var el=addNew(uid,"div");
    document.body.appendChild(el);	
    return el;
},
addScreenMask:function(uid,opacity){
	var el=addNew(uid,"screenmask");
	opacity=isNaN(opacity)?0.5:opacity;
	if( 'undefined,null'.indexOf( typeof(bgcolor) ) ==-1) bgcolor='lightgray';
	//opacity:0.3; 影响子元素透明度，且不能改；
	el.style.cssText=`
	display:flex;flex-direction:row;justify-content:center;align-items:center;
	z-index: 9999;
	position: absolute;left:0px;top:0px;right:0px;bottom:0px;
	font-size: 16px;
	background: rgba(0,0,0,${opacity})
	`;
    document.body.appendChild(el);	
    return el;
}
}//-----------------------------------

var jmask={
	show:function(uid,opacity){
	 if( (opacity==undefined)||(opacity==null)){opacity=0.3;};	 
     var thiz=this;
     this.close(uid);
	 mask = document.createElement('div'); mask.id=uid;
     mask.style.cssText=`display:flex;flex-direction:row;justify-content:center;align-items:center;position: absolute;z-index: 9999999;background:rgba(0,0,0,${opacity});font-size: 16px;left:0px;top:0px;right:0px;bottom:0px;`;
     document.body.appendChild(mask);	
     return mask;
	},
  close:function(uid){
	var mask=document.querySelector("#"+uid) ;
	if(   (mask!=undefined)&&(mask!=null)  ){ mask.parentNode.removeChild(mask);};
  }
}//---------------------------------
var jdialog={
/* 
 //弹出输入窗口
 var html='<div id="edt" contenteditable="true" style="flex:1;border:1px solid lightgray;margin:3px;">aab</div>';
 jdlg.show("xx","注意",'请输入：',html,"确定,取消","250px","auto",function(caption){
	 alert( document.querySelector('#edt').innerText );
	jdlg.close("xx");
});

//确认对话框
 var html='<div id="edt"  style="flex:1;margin:3px;padding-left:5px;">你确定删除吗？<br>xx</div>';
 jdlg.show("xx1","注意",'',html,"确定,取消","250px","auto",function(caption){
	 alert( document.querySelector('#edt').innerText );
	jdlg.close("xx1");
});

//提示框
 var html='<div id="edt"  style="flex:1;margin:3px;padding-left:5px;">操作成功！<br>xx</div>';
 jdlg.show("xx2","注意",'',html,"确定","250px","auto",function(caption){
	 alert( document.querySelector('#edt').innerText );
	jdlg.close("xx2");
});
*/

uniqueAddDialogStyle:function(uid){
   var el=document.querySelector(uid);
   if('undefined,null'.indexOf(typeof(document.querySelector(uid)))!=-1) return;//已存在;
   el=document.createElement("style");el.id=uid;
var css=`
screenmask,.screenmask{
	display:flex;flex-direction:row;justify-content:center;align-items:center;
	z-index: 999999;
	position: absolute;left:0px;top:0px;right:0px;bottom:0px;
	background:rgba(100, 100, 100,.7);
	font-size: 16px;
}

dlgform,.dlgform{
	display:flex;flex-direction:column;justify-content:flex-start;
	z-index: 9999;font-size: 16px;
	left:0; right:0; top:0; bottom:0;
    margin:auto;

	background-color:white;padding:5px;
	border-radius:5px;
	font-size:1.1rem;
	
}
dlgheader,.dlgheader{
    display:flex;flex-direction:column;justify-content:center;align-items:flex-start; 
    padding-left:15px;
    height:35px;flex-shrink:0;
    color:#3582d8;
}
lineborder{/* F8F8FF */
	display:flex;height:0px;border:1px solid #dd;border-bottom:0px;;transform:scale(0.9,0.1);
	}
dlghint,.dlghint{
	padding-left:6px;
	height:25px;font-size:1.0rem;
	display:flex;flex-direction:column;justify-content:center;align-items:stretch;
    }
dlgbody,.dlgbody{
	flex:1;
    margin:5px;margin-top:0px;
	display:flex;flex-direction:column;justify-content:center;align-items:stretch;
    }
dlgfooter,.dlgfooter{
	display:flex;flex-direction:row;justify-content:center;align-items:center;
	flex-shrink:0;
	height:38px;
    }
dlgbutton,.dlgbutton{
    flex:1;
    display:flex;flex-direction:row;justify-content:center;align-items:center;
    background-color:#3582d8;
    color:white;
    margin:3px;
    border-radius:3px;
    height:30px;flex-shrink:0;
	}
`;
    el.innerHTML=css;
    document.getElementsByTagName("head")[0].appendChild(el); 
},
 
 show:function(uid,caption,hintHtml,bodyHtml,btncaptions,width,height,Fn_click_caption ){
      this.uniqueAddDialogStyle('dlgcss'+uid);    
      var btnstr='';
      var captionarr=btncaptions.split(",");
      for(var i=0;i<captionarr.length;i++){
      	if(captionarr[i].trim()=='')continue;
          btnstr=btnstr+'<div class="dlgbutton" >'+captionarr[i]+'</div>';
      }
      var btnHtml=btnstr;
      hintHtml=(hintHtml.trim()=='')?'':`<dlghint>${hintHtml}</dlghint>`;
     var thiz=this;
 
     var html =`
<dlgform style="width:${width};height:${height};">
<dlgheader class="">${caption}</dlgheader>
<lineborder></lineborder>
${hintHtml}
<dlgbody class="" >${bodyHtml}</dlgbody>
<div class="dlgfooter">${btnHtml}</div>
</dlgform>
      `; 
   var screenmask=jmask.show('dlgmask'+uid);
   screenmask.innerHTML=html;
   //绑定事件
      var list= screenmask.querySelectorAll('.dlgbutton');
      for (const button of list) {
         button.addEventListener('click', function(event) {
         	var caption=event.target.innerText.trim();
         	Fn_click_caption(caption);
         	thiz.close('dlgmask'+uid);//确保关闭
       })
      };

      return screenmask;
  },
  close:function(uid){
	var mask=document.querySelector("#"+uid) ;
	if(   (mask!=undefined)&&(mask!=null)  ){ mask.parentNode.removeChild(mask);};
  }
}

jinputdialog={
  show(uid,caption,hintHtml,defautInput,width,height,fn_btncaption_inputvalue){
 //弹出输入窗口
 var contentHtml=`<div id="inputedit${uid}" contenteditable="true" style="flex:1;border:1px solid lightgray;margin:3px;">${defautInput}</div>`;
 jdialog.show(uid,caption,hintHtml,contentHtml,"确定,取消",width,height,function(btncaption){
	fn_btncaption_inputvalue(btncaption, document.querySelector(`#inputedit${uid}`).innerText.trim() );
	jdialog.close(`inputedit${uid}`);
  });//------
  }
}
jconfirmdialog={
  show(uid,caption,confirmText,width,height,fn_btncaption){
 //弹出输入窗口
 var contentHtml=`<div id="inputedit${uid}" style="flex:1;border:margin:15px;padding:5px;shrink:0;">${confirmText}</div>`;
 jdialog.show(uid,caption,'',contentHtml,"确定,取消",width,height,function(btncaption){
	fn_btncaption(btncaption  );
	jdialog.close(`inputedit${uid}`);
  });//------
  }
}
jmsgdialog={
  show(uid,caption,confirmText,width,height,fn_btncaption){
 //弹出输入窗口
 var contentHtml=`<div id="inputedit${uid}" style="flex:1;border:margin:15px;padding:5px;">${confirmText}</div>`;
 jdialog.show(uid,caption,'',contentHtml,"确定",width,height,function(btncaption){
	if(fn_btncaption!=undefined) fn_btncaption(btncaption  );
	jdialog.close(`inputedit${uid}`);
  });//------
  }
}
/*
//确认对话框
 var html='<div id="edt"  style="flex:1;margin:3px;padding-left:5px;">你确定删除吗？<br>xx</div>';
 jdlg.show("xx1","注意",'',html,"确定,取消","250px","auto",function(caption){
	 alert( document.querySelector('#edt').innerText );
	jdlg.close("xx1");
});

//提示框
 var html='<div id="edt"  style="flex:1;margin:3px;padding-left:5px;">操作成功！<br>xx</div>';
 jdlg.show("xx2","注意",'',html,"确定","250px","auto",function(caption){
	 alert( document.querySelector('#edt').innerText );
	jdlg.close("xx2");
});
*/
var jfloatDiv={
  show(uid,css){
     this.close(uid);
	 var el = document.createElement('div'); el.id=uid;
if(css==undefined)css=`
display:flex;flex-direction:column;justify-content:center;
border:1px solid red;
position: absolute;z-index:99999;
background-color:white;
right:0px;top:0px;
`;
     el.style.cssText=css;
     document.body.appendChild(el);	
     el.innerHTML=`
hello
`;
      return el;
  },
  close(uid){
	var el=document.querySelector("#"+uid) ;
	if(   (el!=undefined)&&(el!=null)  ){ el.parentNode.removeChild(el);}; 
  }
}
jtoast={
    show:function(msg,duration){//toast('这是一个弹框',2000)
      duration=isNaN(duration)?500:duration;
       var m = document.createElement('div');
       m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      window.jktoast777=m;
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
  },
  close:function(){
      document.body.removeChild( window.jktoast777 );
  }
}

var jloading={
  close:function(uid){
         clearInterval(window.jkinterval777);
         jmask.close('mask'+uid);
  },
  show:function(uid,txt,timeout){
      window.jkinterval777=-1;
      if(txt==undefined)txt='waiting ';
          var obj=document.createElement('div');
          obj.innerText==txt+'∴';
          obj.id='hint'+uid;
          obj.style.cssText=`
max-width:60%;min-width:100px;min-height:35px;border-radius: 4px;
display:flex;flex-direction:row;justify-content:center;align-items:center;
z-index:999999;
background:gray;
radius:8px;
height:auto;padding:3px 15px;
font-size:18px;color:white;
`;
  		 
          obj.style.display='';
           window.jkinterval777=setInterval(function(){  
			   if(obj.innerText==''){ obj.innerText=txt+'∴';return;}
               if(obj.innerText==txt+'∴'){ obj.innerText=txt+'∵';return;}
               if(obj.innerText==txt+'∵'){ obj.innerText=txt+'∴';return;}
			   return;//100
           },550);
      var mask=jmask.show('mask'+uid,0);
       mask.appendChild(obj);
       obj.innerText==txt+'∴';
      
           //默认3秒定时关闭
           if( typeof(timeou)!= "undefined" )  timeout=3*1000;
           setTimeout(function(){
               clearInterval(window.jkinterval777); 
               jmask.close('mask'+uid);
           },timeout );
 
     }//show;
}//--------------------------------------
 
var jwidget={
	mask:jmask,
    toast:jtoast,
	loading:jloading,
	dialog:jdialog,
	inputdialog:jinputdialog,
	confirmdialog:jconfirmdialog,
	msgdialog:jmsgdialog,
}

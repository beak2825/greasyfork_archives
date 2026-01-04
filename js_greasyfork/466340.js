// ==UserScript==
// @name         oapizhu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://oa.eccjt.com:88/spa/workflow/static4form/index.html*
// @run-at       document-end
// @grant        window.close
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/466340/oapizhu.user.js
// @updateURL https://update.greasyfork.org/scripts/466340/oapizhu.meta.js
// ==/UserScript==

var x = 0;
function closeoa() {
 var Browser = navigator.appName;
 var indexB = Browser.indexOf('Explorer');

 if (indexB > 0) {
    var indexV = navigator.userAgent.indexOf('MSIE') + 5;
    var Version = navigator.userAgent.substring(indexV, indexV + 1);

    if (Version >= 7) {
        window.open('', '_self', '');
        window.close();
    }
    else if (Version == 6) {
        window.opener = null;
        window.close();
    }
    else {
        window.opener = '';
        window.close();
    }

 }
else {
    window.close();
 }
}


function getform() {
    var users=document.querySelectorAll('span[id^="field7712"]')
    var hosts=document.querySelectorAll('span[id^="field7802"]')
    var protocols=document.querySelectorAll('input[id^="field14546"]')
    var times=document.querySelectorAll('span[id^="field7714"]')
    var alllist = new Array();
    var dic = new Array();
    dic[0] = 'rdp';
    dic[1] = 'ssh'
    dic[2] = 'sqlserver'
    dic[3] = 'mysql'
    users.forEach((user, index) => {
        var sdata = "";
        const host = hosts[index];
        const protocol = protocols[index];
        const time = times[index];
        //alllist[index] = user.firstChild.nodeValue+"@"+host.firstChild.nodeValue+"@"+ dic[protocol.defaultValue] +"@"+time.firstChild.nodeValue ;
        sdata = user.firstChild.nodeValue.trim()+"@"+host.firstChild.nodeValue.trim()+"@"+ dic[protocol.defaultValue].trim() +"@"+time.firstChild.nodeValue.replace(/：/ig,":").trim();
        console.log(sdata);
        alllist[index] = sdata ;
        //if (sdata.indexOf("192.168.5.5") == -1 && sdata.indexOf("192.168.127.4@") == -1 && sdata.indexOf("192.168.127.56") == -1 && sdata.indexOf("192.168.5.20") == -1 && sdata.indexOf("192.168.5.16") == -1 && sdata.indexOf('192.168.5.18') == -1) {alllist[index] = sdata ;}
        }
    );
    return alllist;
}

function getform_jj() {
    var users=document.querySelectorAll('span[id^="field29152"]')
    var hosts=document.querySelectorAll('span[id^="field29155"]')
    var protocols=document.querySelectorAll('input[id^="field29157"]')
    var times=document.querySelectorAll('span[id^="field29154"]')
    var alllist = new Array();
    var dic = new Array();
    dic[0] = 'rdp';
    dic[1] = 'ssh'
    dic[2] = 'sqlserver'
    dic[3] = 'mysql'
    users.forEach((user, index) => {
        var sdata = "";
        const host = hosts[index];
        const protocol = protocols[index];
        const time = times[index];
        //alllist[index] = user.firstChild.nodeValue+"@"+host.firstChild.nodeValue+"@"+ dic[protocol.defaultValue] +"@"+time.firstChild.nodeValue ;
        sdata = user.firstChild.nodeValue.trim()+"@"+host.firstChild.nodeValue.trim()+"@"+ dic[protocol.defaultValue].trim() +"@"+time.firstChild.nodeValue.replace(/：/ig,":").trim();
        console.log(sdata);
        alllist[index] = sdata ;
        //if (sdata.indexOf("192.168.5.5") == -1 && sdata.indexOf("192.168.127.4@") == -1 && sdata.indexOf("192.168.127.56") == -1 && sdata.indexOf("192.168.5.20") == -1 && sdata.indexOf("192.168.5.16") == -1 && sdata.indexOf('192.168.5.18') == -1) {alllist[index] = sdata ;}
        }
    );
    return alllist;
}


function getform_kefu() {
    var users=document.querySelectorAll('span[id^="field27501"]')
    var hosts=document.querySelectorAll('span[id^="field27502"]')
    var protocols=document.querySelectorAll('input[id^="field27506"]')
    var times=document.querySelectorAll('span[id^="field27505"]')
    var alllist = new Array();
    var dic = new Array();
    dic[0] = 'rdp';
    dic[1] = 'ssh'
    dic[2] = 'sqlserver'
    dic[3] = 'mysql'
    users.forEach((user, index) => {
        var sdata = "";
        const host = hosts[index];
        const protocol = protocols[index];
        const time = times[index];
        //alllist[index] = user.firstChild.nodeValue+"@"+host.firstChild.nodeValue+"@"+ dic[protocol.defaultValue] +"@"+time.firstChild.nodeValue ;
        sdata = user.firstChild.nodeValue.trim()+"@"+host.firstChild.nodeValue.trim()+"@"+ dic[protocol.defaultValue].trim() +"@"+time.firstChild.nodeValue.replace(/：/ig,":").trim();
        console.log(sdata);
        alllist[index] = sdata ;
        //if (sdata.indexOf("192.168.5.5") == -1 && sdata.indexOf("192.168.127.4@") == -1 && sdata.indexOf("192.168.127.56") == -1 && sdata.indexOf("192.168.5.20") == -1 && sdata.indexOf("192.168.5.16") == -1 && sdata.indexOf('192.168.5.18') == -1) {alllist[index] = sdata ;}
        }
    );
    return alllist;
}

function sendtoredis(res){
        //var res = getform()
        //console.log(res);
        GM_xmlhttpRequest({
            method: 'POST',
            //后端接口
            url:"http://192.168.64.65:10080/add",
            contentType:"application/json",
            dataType:"json",
            //数据
            data: JSON.stringify({"add" : res}),
            headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        });
}


function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

setTimeout(function init(){
    'use strict';
    var reject = document.querySelector('span[class="wf-reject-msg-time"]')
    var picknext = document.querySelector('div[data-fieldmark="field6994"]')
    var pizhun = document.querySelector('button[title="批准"]');
    var pizhun1 = document.querySelector('button[title="批准"]');
    var pizhu = document.querySelector('button[title="批注"]');
    var tijiao = document.querySelector('button[title="提交"]');
    var title=document.querySelector('div[data-cellmark="main_0_0"] span');
    var shenqingren=document.querySelector('div[data-cellmark="main_3_1"] span');
    if (! shenqingren) {shenqingren=document.querySelector('div[data-cellmark="main_3_1"]');}
    var apply_name = "";
    if (shenqingren) {apply_name = shenqingren.innerText;}
    var liucheng=document.querySelector('div[class="wea-new-top-req-title-text wea-f14"]')
    //var title1=document.querySelector('div[data-cellmark="main_0_0"] span');
    //var subject=document.querySelector('div[data-cellmark="main_2_1"] div input');
    //if (content1 && (!content1.innerText)) {
    //    dic[0]="notify-虚拟机申请流程";
    //} else {
    //    dic[0]="notify-" + content1.innerText;
        //console.log(dic);
    //}

    var casedate1=document.querySelector('div[data-cellmark="main_2_3"] span');
    var c=0;
    if (!casedate1 && c<3) {c=c+1;setTimeout(init, 2000);}
    if (casedate1) {
      //var casedate1=document.querySelector('span[class^="child-item wdb"]');
      var casedate=casedate1.innerText.replace(/-/ig,"");
      //console.log(casedate);
    }
    var myDate = new Date();
    var year=myDate.getFullYear();
    var month1=myDate.getMonth()+1;
    var month=month1 < 10 ? '0' + month1 : '' + month1;
    var day1=myDate.getDate();
    var day=day1 < 10 ? '0' + day1 : '' + day1;
    var rundate=year.toString() + month.toString() + day.toString();
    //console.log(rundate)
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    //if (reject) { closeoa();}

    //console.log(title1);
    //console.log(1111111112222333);
    //console.log(subject);
    // title.innerText.indexOf('付款申请单') != -1 || title.innerText.indexOf('合同审批') != -1 || title.innerText.indexOf('机构数据修改') != -1 ||
    if (liucheng) {
      if ( reject || picknext || liucheng.innerText.indexOf('系统变更申请') != -1 || liucheng.innerText.indexOf('信息系统运维') != -1 || liucheng.innerText.indexOf('wula服务器申请流程') != -1 || liucheng.innerText.indexOf('虚拟机') != -1 || liucheng.innerText.indexOf('外网域名解析') != -1 || liucheng.innerText.indexOf('财务付款申请') != -1 ) {
        console.log(liucheng.innerText);
        var subject=document.querySelector('div[data-fieldmark="field-1"] div input');
        //var liucname=document.querySelector('div[class="wea-new-top-req-title-text wea-f14"] div');
        //console.log(title)
        var b=0;
        //var d=0;
        if (!subject && b<3) {b=b+1;setTimeout(init, 1000);}
        if (subject && !(subject.innerText) && b<3) {b=b+1;setTimeout(init, 1000);}
        //var subjectvalue = subject.innerText;
        //if (! subjectvalue) {subjectvalue = subject.value;}
        var dic = new Array();
        //add new
        //var dicsub = new Array();
        //if (subject) {
        //    if ( subject.innerText.toUpperCase().indexOf('紧急') != -1 ) {
        //        dicsub[0]="OA-" + subject.value; console.log(subject.value);
        //        sendtoredis(dicsub);
        //    }
        //}
        //end
        if (subject && title) { dic[0]="OA-" + title.innerText + "-" + subject.value; console.log(subject.value);} else if (title) { dic[0]="OA-" + title.innerText;} else if (subject) { dic[0]="OA-" + subject.innerText;} else {dic[0]="OA-check new oa message!";}
        dic[0] = dic[0] + subject.value + "@" + month1 + "-" + day1 + "@" + apply_name;
        //console.log(dic);
        sendtoredis(dic);
        sleep(3000);
        closeoa();
      }
    } else {
        console.log(1111111111111111111122221);

    }

	//if (pizhun && title && title.innerText.indexOf('远程访问服务器权限申请') == -1 ) {
    //    if (pizhun) {
        //if (hour == 23 && minute>36) {
    //        console.log(11111111111111)
	//	    pizhun.click();
    //        console.log('clicked2');
     //       sleep(3000);
	  //  } else {
	  //    if (pizhu) {
		//    pizhu.click();
		  //} else if (tijiao) {tijiao.click();}
	    //}
    //}
    //if (casedate<rundate) {console.log('another day!')}
    //if (pizhun && title && (title.innerText.indexOf('远程访问服务器权限申请') != -1 )) {
    if (pizhun && title) {
        var ress=getform();
        if (ress.length == 0) {
            ress=getform_jj();
        }
        if (ress.length == 0) {
            ress=getform_kefu();
        }
        var flag = "";
        var flag1 = "";
        //console.log(ress);
        if (ress) {
            var resstr=ress.toString();
            flag = resstr.indexOf("192.168.5.5") == -1 && resstr.search(/\b192.168.127.4\b/) == -1 && resstr.indexOf("192.168.127.56") == -1 && resstr.indexOf("192.168.5.20") == -1 && resstr.indexOf("192.168.5.16") == -1 && resstr.indexOf('192.168.5.18') == -1
            flag1 = resstr.indexOf("ptb1111") != -1 && (resstr.indexOf("192.168.5.5") != -1 || resstr.search(/\b192.168.127.4\b/) != -1 || resstr.indexOf("192.168.127.56") != -1 || resstr.indexOf("192.168.5.20") != -1 || resstr.indexOf("192.168.5.16") != -1 || resstr.indexOf('192.168.5.18') != -1)
        //var flag = "1";
        } else {
            flag = false;
            flag1 = false;
        }

        if (casedate && rundate>casedate) {
            //sendtoredis(ress);
            try {
              pizhun.click();
              //closeoa();
            } catch (e) {
              console.log(e);
              closeoa();
            }
            //sleep(3000);
        } else if(flag) {
            //use
            sendtoredis(ress);
            try {
              pizhun.click();
              //closeoa();
            } catch (e) {
              console.log(e);
              closeoa();
            }
            //console.log(resstr);
            //pizhun.click();
            //sleep(3000);
            //console.log('clicked1112222');
            ///sleep(3000);
            ////setTimeout(closeoa, 6000);
        } else if(flag1) {
            ////sendtoredis(ress);
            closeoa();
        } else if (ress) {
            //use
            sendtoredis(ress);
            try {
              pizhun.click();
              //closeoa();
            } catch (e) {
              console.log(e);
              closeoa();
            }
            //pizhun.click();
            //sleep(3000);
        } else if(pizhun) {
            //console.log(pizhun);
            try {
              pizhun.click();
              closeoa();
            } catch (e) {
              console.log(e);
              closeoa();
            }
            //pizhun.click();
            //sleep(3000);
            console.log(pizhun1);
            ///////////////sleep(3000);
            //sendtoredis(dic);
            closeoa();}
        } else {
            if (pizhu) {
                    pizhu.click();
                    //sleep(3000);
                } else if (tijiao) {tijiao.click();} else {
                  closeoa();
                }
        }
},5000);

//(function init(){'use strict';var counter = document.querySelectorAll('button[title="批准"]');if (counter.length>0) { counter[0].click() } else { setTimeout(init, 3);}})();

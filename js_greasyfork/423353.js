// ==UserScript==
// @name         信息培训1.0_上线版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://cn202131004.stu.teacher.com.cn/*
// @downloadURL https://update.greasyfork.org/scripts/423353/%E4%BF%A1%E6%81%AF%E5%9F%B9%E8%AE%AD10_%E4%B8%8A%E7%BA%BF%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/423353/%E4%BF%A1%E6%81%AF%E5%9F%B9%E8%AE%AD10_%E4%B8%8A%E7%BA%BF%E7%89%88.meta.js
// ==/UserScript==
String.prototype.signMix= function() {
	if(arguments.length === 0) return this;
	var param = arguments[0], str= this;
	if(typeof(param) === 'object') {
		for(var key in param)
			str = str.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
		return str;
	} else {
		for(var i = 0; i < arguments.length; i++)
			str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
		return str;
	}
};

function make_div(pp,ppp){
    var divObj=document.createElement("div");
    divObj.id="dialoggg";
    divObj.style.background=ppp;
    divObj.style.width="300px";
    divObj.style.border="5px solid blue";
    divObj.style.position="fixed";
    divObj.style.right="5%";
    divObj.style.top="25%";
    divObj.style["z-index"]=999;
    divObj.innerHTML=pp;
    divObj.style.fontSize="33px";

    var first=document.body.firstChild;
    document.body.insertBefore(divObj,first);
};
make_div("脚本正在运行!!!!!!!!!  <br><br><br>然后稍等10秒,会有提示<br><br><br>按照提示进行操作即可<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了","red");

function update_div(pp,ppp){
    var divObj=document.getElementById("dialoggg");
    divObj.style.background=ppp;
    divObj.innerHTML=pp;
};

function unique(arr){
	for (let i=0; i<arr.length; i++){
		for(let j=i+1; j<arr.length; j++){
			if (arr[i] == arr[j]){
				arr.splice(j,1)
				j--
			}
		}
	}
	return arr
};

function get_projects(){

    var kkss=document.querySelectorAll("#act-list-item > div.listcon > div > div.listcontent > ul > li:nth-child(1) > div.con > ul > li>a ");
    var kk=[];
    for (var ii=0;ii<kkss.length;ii++){
        kk.push(kkss[ii].getAttribute("href"));
    };

    kkss=unique(kk);
    if(kkss.length>2){
        update_div("成功拿到了所有课程! <br><br>请您 立即点击您未学习的课程<br><br> 注意::(点一个就行了,到了后面脚本看完后,会自动模拟点击<br><br>跳转到下一个)!!!<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了","pink");

        localStorage.all_need_solve_urls=JSON.stringify(kkss);
        var kkssjj=document.querySelectorAll("#act-list-item > div.listcon > div > div.listcontent > ul > li:nth-child(1) > div.con > ul > li>a ")[0];
        //kkssjj.focus();
        //kkssjj.click();
        //window.open(kkss[0],"_blank");
        //window.location.href=kkss[0];
       }else{
        make_div("*****************************没有拿到*****************************","red");
       };
};

function find_something(){
     var kk=document.querySelectorAll("div.layui-layer-btn.layui-layer-btn- > a")[0];
    return kk==undefined;

};

function do_something(need_watch,all_urls,furture_to){
    //刷新时间;
    document.querySelector("body > div.content > div.studyCourseTime > p.studyCourseTimeRefresh").click();
    var have_watch=parseInt(document.querySelector("#courseStudyMinutesNumber").innerText);
    if(have_watch==need_watch){
        window.location.href=all_urls[furture_to]
    }else{
        var flag=find_something();
        if (!flag){
            document.querySelectorAll("div.layui-layer-btn.layui-layer-btn- > a")[0].click();
            update_div("<br>检测到了阻止播放弹窗<br><br><br> 并进行了破解!<br><br>即将结束!!!!!<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了","green");
        }else{
            update_div("<br><br>当前已经观看 {0} 分钟<br><br>即将结束!!!!!<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了".signMix(have_watch),"pink");
        };
    };
};

function key_main(){

    //获取所有链接,以及当前页面位于哪一个位置
    var all_urls=JSON.parse(localStorage["all_need_solve_urls"]);
    var index=all_urls.indexOf(window.location.href.replace("http:",""));
     //当前页面需要观看时间
    var need_watch=parseInt(document.querySelector("#courseStudyBestMinutesNumber").innerText);
    var have_watch=parseInt(document.querySelector("#courseStudyMinutesNumber").innerText);
    var furture_to=index+1;
    update_div("<br>总共有 {4} 节课程 <br><br>当前位于第 {0} 节<br><br>需要观看 {1} 分钟 <br><br>当前已经观看 {2} 分钟 <br><br>即将跳转到第 {3} 节<br><br>请保持本页面,不要关闭去玩耍吧<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了".signMix(index,need_watch,have_watch,furture_to,all_urls.length),"pink");


    setInterval(function(){do_something(need_watch,all_urls,furture_to)},1*60*1000);

};


(function() {
    if(window.location.href.startsWith("http://cn202131004.stu.teacher.com.cn/studyPlan/intoStudentStudy")){
        setTimeout(get_projects, 10*1000 );
    }else if (window.location.href.startsWith("http://cn202131004.stu.teacher.com.cn/course/")){
        setTimeout(key_main, 10*1000 );
    }else if(window.location.href=="http://cn202131004.stu.teacher.com.cn"){
        update_div("当前不是工作页面!!!!!<br><br>请选择正确的页面 然后停留10秒钟!<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了","red");
    }else{
        update_div("当前不是工作页面!!!!!<br><br>请选择正确的页面 然后停留10秒钟!<br><br>页面卡顿了话 鼠标左击地址栏,直接双击就行了","red");

 };
})();
























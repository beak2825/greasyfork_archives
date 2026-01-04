// ==UserScript==
// @name         网页弹窗无障碍化
// @version      0.6
// @description  为视障人士设计，解决在网页中点击出现弹窗后难聚焦到弹窗、弹窗中内容不可访问的问题。
// @author       You
// @match        *
// @match        */*
// @match        */*/*
// @match        */*/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      Mozilla Public License 1.1
// @namespace https://greasyfork.org/users/961092
// @downloadURL https://update.greasyfork.org/scripts/451628/%E7%BD%91%E9%A1%B5%E5%BC%B9%E7%AA%97%E6%97%A0%E9%9A%9C%E7%A2%8D%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451628/%E7%BD%91%E9%A1%B5%E5%BC%B9%E7%AA%97%E6%97%A0%E9%9A%9C%E7%A2%8D%E5%8C%96.meta.js
// ==/UserScript==

'use strict';
this.$ = this.jQuery = jQuery.noConflict(true);
var nowpop;//当前弹窗
function Clickcan(element){//该元素下是否有可点击元素
    let stack= [];
    stack.push(element);
   while(stack.length!=0){
		let temp = stack.pop();
        if(clickableele(temp) && temp.target!='_blank' ){
                return true;
        }
     let stackson = [];
		stackson = Array.from(temp.children);//伪数组数组化
		if(stackson.length==0){
			continue;
		}else{
		for(let i=stackson.length-1;i>-1;i--){
			stack.push(stackson[i]);
		  }
		}
    }
	return false;
}
function buclick(element){
    if(element.tagName!='P'&&element.target!='_blank'&&!Belongfa(element,nowpop)){
        return true;
    }else{
    return false;
    }

}//只要不是链接到外面，里面只要有东西非p都加上
function SomethingIn(element){
    if(element.tagName=='SVG'||typeof element=='undefined'||typeof element.innerText=='undefined'){
        return false;
    }
    if(element.innerText.length>0 || window.getComputedStyle(element).backgroundImage.indexOf('url')!=-1
      ){
        return true;
    }else{
        return false;
    }

}
function Sonnotfather(element) {//除该元素外其子元素无其他元素满足条件
	let stack= [];
    stack.push(element);
    while(stack.length!=0){
		let temp = stack.pop();
		if(temp != element){
			if(typeof temp!='undefined'&&clickableele(temp)&& temp.target != '_blank' && SomethingIn(temp)){
				return false;
			}
            if(temp.tagName=='A' && temp.target!='_blank'&&!Belongfa(temp,nowpop)){
                    return false;
            }
            if(temp.tagName=='BUTTON' && temp.target!='_blank'&&!Belongfa(temp,nowpop)){
                    return false;
            }
            if(buclick(temp)){
                return false;
            }
		}
        let stackson = [];
		stackson = Array.from(temp.children);//伪数组数组化
		if(stackson.length==0){
			continue;
		}else{
		for(let i=stackson.length-1;i>-1;i--){
			stack.push(stackson[i]);
		  }
		}
    }
	return true;
}
function runtest(element){//可能的元素添加事件
    console.log('当前nowpop为：')
    console.log(nowpop)
    let stack= [];
    stack.push(element);
   while(stack.length!=0){
		let temp = stack.pop();
        if(typeof temp!='undefined'&&temp.tagName!='SVG'&&clickableele(temp) && temp.target!='_blank' && SomethingIn(temp)&&!Belongfa(temp,nowpop)){
			if(Sonnotfather(temp)){
                temp.removeEventListener("click", delaypop)
				temp.addEventListener("click", delaypop)
				//console.log(temp);
			}
		}else if(temp.tagName=='A' && temp.target!='_blank'&&!Belongfa(temp,nowpop)){
			if(Sonnotfather(temp)){
                temp.removeEventListener("click", delaypop)
				temp.addEventListener("click", delaypop)
				//console.log(temp);
			}
		}else if(temp.tagName=='BUTTON' && temp.target!='_blank'&&!Belongfa(temp,nowpop)){
			if(Sonnotfather(temp)){
                temp.removeEventListener("click", delaypop)
				temp.addEventListener("click", delaypop)
				//console.log(temp);
			}
        }else if(temp.tagName!='SVG'&&buclick(temp)){
            if(Sonnotfather(temp)){
                temp.removeEventListener("click", delaypop)
				temp.addEventListener("click", delaypop)
          }
        }
     let stackson = [];
		stackson = Array.from(temp.children);//伪数组数组化
		if(stackson.length==0){
			continue;
		}else{
		for(let i=stackson.length-1;i>-1;i--){
			stack.push(stackson[i]);
		  }
		}
    }
    console.log('已更新可能元素')
}
function delaypop(){
    window.setTimeout(popupisnot,1000);
}

function addfuncprint(elements) {
	for(let ele of elements){
		ele.addEventListener("click", () => {
			console.log(ele);
		})
	}
}
function sleep(callback, time) {
    if (typeof callback == "function") {
        setTimeout(callback, time);
    }
}
//以上是运行前的准备









function popupisnot(){//弹窗处理模块
var presuccessclassName = '';
var modalele = null;
var presuccess;
var maskelestack = [];
//判断过的遮罩层集合（但由于元素消失后无法获得element，故改为存储类名）
var modalelestack = [];
//已经取过的弹窗元素集合（但由于元素消失后无法获得element，故改为存储类名）
var multimodalstack = [];
//遮罩层和弹窗元素的合并集合（但由于元素消失后无法获得element，故改为存储类名）

function sleep(callback, time) {
    if (typeof callback == "function") {
        setTimeout(callback, time);
    }
}
function Ifrmodal(){
    function GetModal(ele) {
            function getSize(ele) {
            //判断元素的大小，长*宽
            if(window.getComputedStyle(ele).display == 'none'
               ||window.getComputedStyle(ele).display == 'hidden' ){
                return 0;
            }
            var rect = ele.getBoundingClientRect();
            var top = document.documentElement.clientTop;
            var left = document.documentElement.clientLeft;
            let top0 = rect.top - top;
            let bottom0 = rect.bottom - top;
            let left0 = rect.left - left;
            let right0 = rect.right - left;
            if((bottom0 - top0) * (right0 - left0)==0 && ele.children.length!=0){
                let allson = Array.from(ele.children);
                let sum = 0;
                for(let i=0;i<allson.length;i++){
                    sum+=getSize(allson[i]);
                }
                return sum;
            }else{
                return (bottom0 - top0) * (right0 - left0);
            }
        }
            function blackable(ele) {
            //判断是否满足是遮罩层条件的，主要是获取RGB值，各个位置应该取值范围
            let groundcolor = window.getComputedStyle(ele).backgroundColor;
            let rrrggbb = groundcolor.split('(')[0];
            //获取字符串元素进行比较，背景色只有两种形式
            let mayequal = false;
            if (rrrggbb == 'rgb') {
                let firststr = groundcolor.split('(')[1].split(',')[0];
                let secondstr = groundcolor.split('(')[1].split(',')[1];
                let thirdstr = groundcolor.split('(')[1].split(',')[2].split(')')[0];
                let first = parseInt(firststr.trim());
                let second = parseInt(secondstr.trim());
                let third = parseInt(thirdstr.trim());
                mayequal = (first - second > -6) && (first - second < 6) && (first - third > -6) && (first - third < 6);
                if (mayequal && first < 111) {
                    return true;
                } else if (first < 25 && second < 25 && third < 25) {
                    return true;
                } else {
                    return false;
                }
            } else if (rrrggbb == 'rgba') {
                //四个位置对应四个数字
                let firststr = groundcolor.split('(')[1].split(',')[0];
                let secondstr = groundcolor.split('(')[1].split(',')[1];
                let thirdstr = groundcolor.split('(')[1].split(',')[2];
                let fourthstr = groundcolor.split('(')[1].split(',')[3].split(')')[0];
                let first = parseInt(firststr.trim());
                let second = parseInt(secondstr.trim());
                let third = parseInt(thirdstr.trim());
                let fourth = Number(fourthstr.trim());
                if (first < 40 && second < 40 && third < 40 && fourth > 0 && fourth < 0.9) {
                    return true;
                } else {
                    return false
                }
            }
            console.log(groundcolor)
            console.log(rrrggbb)
            return false;

        }
        function Notcomplexin(element) {//遮罩层是不复杂的
            if(element.querySelector('a') ==null &&
               element.querySelector('video')==null && element.querySelector('script') ==null){
                return true;
            }else{
                return false;
            }
        }
        function ChilddivNum(ele) {//含有div标签数量
            if(ele.children.length ==0){
                return 0;
            }
            let childstack= [];
            childstack = Array.from(ele.children);
            let sumnum = 0;
            for(let i=0;i<childstack.length;i++){
                sumnum+=ChilddivNum(childstack[i]);
            }
            if(ele.tagName == 'DIV'){
                return 1+sumnum;
            }else{
                return sumnum;
            }
        }
        function modalneed(element){//可能是弹窗需要的条件
            if(ChilddivNum(element)>5||element.querySelector('table')!=null||element.querySelector('iframe')!=null){
               return true;
               }
            return false;
        }
        function CanUseele(element){
           let allson = Array.from(element.children);
           let simple = false;
           for(let i=0;i<allson.length;i++){
               if(window.getComputedStyle(allson[i]).display == 'block' ){
                   simple = true;
                  }
                if(allson[i].tagName == 'IFRAME'){
                    simple =true;
                }
           }
           return simple;
        }
        let stack = [];
        //辅助栈，存储元素，实现DFS
        let isis = 0;
        //是否有遮罩层出现
        let zindex = 99999999;
        //记录遮罩层的Zindex
        let zindexmax = 0;
        //页面中具有最大zindex 的值
        let zindexmaxstack = [0,0,0,0,0];
        //页面中具有最大zindexindex的集合
        let maybesize = 0;
        //可能是弹窗的尺寸
        let maybeele;
        //可能是弹窗的元素
        let must = 0;
        //是否已出现弹窗元素
        let premaybe;
        //在遮罩之前最大ZIndex的元素
        let premaybestack = [];
        //在遮罩之前最大ZIndex的元素集合
        let preverymaybestack = [];
        //在遮罩之前的且符合条件的
        let aftverymaybestack = [];
        //在遮罩后且符合条件的，进行对比
        let initmaystack = [];
        //在遮罩层深处的可能弹窗
        let masksize;
        //mask的尺寸
        stack.push(ele);
        while (stack.length != 0) {
            let temp = stack.pop();
            //深度优先，在DOM树里是DIV标签元素以及在显示状态的元素是可能的目标
            let simple = false;
            if(typeof temp == 'undefined'){
                continue;
            }
            if (window.getComputedStyle(temp).display == 'none'
                || temp.tagName != 'DIV' || window.getComputedStyle(temp).display == 'hidden'
               ) {
                if (temp.tagName != 'BODY'&&temp.tagName != 'TABLE') {
                    //筛选DIV
                    continue;
                }
            }
            if (maskelestack.length != 0 || modalelestack.length != 0) {
               // console.log('mask里有');
             //   console.log(maskelestack.length);
              //  console.log('modal里有');
             //   console.log(modalelestack.length);
                for (let i = 0; i < maskelestack.length; i++) { //筛选已经判断过的(但公用就判断不出了)
                    if(typeof maskelestack[i]=='object'){
                        if (temp == maskelestack[i]) {
                        simple = true;
                        }
                    }
                    if(typeof maskelestack[i]=='string'){
                        if (temp.className == maskelestack[i]) {
                        simple = true;
                        }
                    }
                }
                for (let i = 0; i < modalelestack.length; i++) {
                    if(typeof modalelestack[i]=='object'){
                        if (temp == modalelestack[i]) {
                        simple = true;
                        }
                    }
                    if(typeof modalelestack[i]=='string'){
                        if (temp.className == modalelestack[i]) {
                        simple = true;
                        }
                    }
            }
        }//现在没加进去的内容
            if(maskelestack.length==0){//遮罩层出来前的记录
                let i=0;
                if(premaybestack.length<5){
                    i =premaybestack.length;
                }
                for(i;i<5;i++){
                    if (parseInt(window.getComputedStyle(temp).zIndex) > zindexmaxstack[i]
                        && CanUseele(temp)) {


                    //将当前为显示状态的DIV元素的最大Zindex值记录
                    zindexmaxstack[i] = parseInt(window.getComputedStyle(temp).zIndex);
                    //并存储元素值，防止错过弹窗DIV
                        if(premaybestack.length<5){
                            premaybestack.push(temp);
                            break;
                        }else{
                            premaybestack[i] = temp;
                            break;
                        }
                    }
                }
            }
            if (blackable(temp) && (getSize(temp) > 64000) &&
                window.getComputedStyle(temp).top == '0px'&&parseInt(window.getComputedStyle(temp).zIndex)>0) {
                if(ChilddivNum(temp)>5||Notcomplexin(temp)){//里面要么啥也没有，要么含个弹窗
                    isis++;
                zindex = parseInt(window.getComputedStyle(temp).zIndex);
                masksize = getSize(temp);
                console.log('遮罩层：');
                console.log(temp);
                if(temp.className == ''){
                    maskelestack.push(temp);
                }else{
                    maskelestack.push(temp.className);
                }
                if(ChilddivNum(temp)>5){
                    let sonofit = Array.from(temp.children);
                    for(let i=0;i<sonofit.length;i++){
                        if(ChilddivNum(sonofit[i])>5){
                            initmaystack.push(sonofit[i]);
                        }
                    }
                    let max1 = 0;
                    let maxsize = getSize(initmaystack[0]);
                    for (let i = 0; i < initmaystack.length; i++) {
                         if(getSize(initmaystack[i])>maxsize){
                            maxsize = getSize(initmaystack[i]);
                            max1 = i;
                        }
                    }
                    modalele = initmaystack[max1];
                    modalelestack.push(modalele);
                    console.log('弹窗与遮罩在一起');
                    must ++;
                }
                for(let i=0;i<premaybestack.length;i++){
                    if (zindexmaxstack[i] > zindex &&
                        zindexmaxstack[i]< 100*zindex&&modalneed(premaybestack[i])) {
                    //遮罩层前的元素有比遮罩层zindex大一倍以内的就说明是弹窗，并在这里记录
                    //console.log('弹窗元素就是：');
                    //  console.log(premaybe);
                    preverymaybestack.push(premaybestack[i]);
                    }
                }//预先可能是弹窗的集合
              }
                //符合条件的是遮罩层
            }
            if (window.getComputedStyle(temp).zIndex != 'auto') {
                //筛选比遮罩zindex大的元素
                let tempindex = parseInt(window.getComputedStyle(temp).zIndex);
                if (tempindex > zindex && tempindex<100*zindex&&modalneed(temp)) {
                    //console.log('弹窗元素就是：');
                    //console.log(temp);
                    aftverymaybestack.push(temp);
                }else if (getSize(temp) > maybesize && tempindex > 0 &&modalneed(temp)) {
                    //没有zindex更大弹窗时，记录显示的最大元素
                    if(maskelestack.length != 0){
                            if(temp== maskelestack[0] || temp.className == maskelestack[0].className||getSize(temp) == masksize){
                                //直接跳过
                            }else{
                                   maybesize = getSize(temp);
                                   maybeele = temp;
                            }
                    }
                }
            }
            let stackson = [];
            stackson = Array.from(temp.children);
            //伪数组数组化
            if (stackson.length == 0) {
                continue;
            } else {
                for (let i = stackson.length - 1; i > -1; i--) {
                    stack.push(stackson[i]);
                }
            }
        }
        if(preverymaybestack.length + aftverymaybestack.length!=0){//开始分析zindex符合要求的哪个是弹窗

                    if(preverymaybestack.length!= 0){
                        console.log("预先的有东西")
                        let max1 = 0;
                        let max2 = 99;
                        let maxsize = getSize(preverymaybestack[0]);
                        for (let i = 0; i < preverymaybestack.length; i++) {
                          if(getSize(preverymaybestack[i])>maxsize){
                             maxsize = getSize(preverymaybestack[i]);
                             max1 = i;
                        }
                      }
                        for(let i=0;i<aftverymaybestack.length;i++){
                            if(getSize(aftverymaybestack[i])>maxsize){
                             maxsize = getSize(aftverymaybestack[i]);
                             max2 = i;
                        }
                      }
                      if(max2==99){//没变说明预先里是最大的
                            modalele = preverymaybestack[max1];
                            console.log('预先里的被输出')
                      }else{
                          modalele = aftverymaybestack[max2];
                          console.log('其后里的被输出')
                      }
                      if(modalele.className == ''){//都经过的输出
                        modalelestack.push(modalele);
                        }else{
                            modalelestack.push(modalele.className);
                        }
                        console.log(modalele)
                        must ++;
                    }else{
                        console.log("后面的有东西")
                        let max2 = 0;
                        let maxsize = getSize(aftverymaybestack[0]);
                        for(let i=0;i<aftverymaybestack.length;i++){
                            if(getSize(aftverymaybestack[i])>maxsize){
                             maxsize = getSize(aftverymaybestack[i]);
                             max2 = i;
                          }
                        }
                        modalele = aftverymaybestack[max2];
                        if(modalele.className == ''){//都经过的输出
                            modalelestack.push(modalele);
                        }else{
                            modalelestack.push(modalele.className);
                        }
                        console.log(modalele);
                        console.log('2');
                        must ++;
                    }
        }
        if (modalelestack.length == 0&&maskelestack.length !=0) {
            if(typeof maybeele == 'undefined'){
                console.log('没找到配套弹窗')
            }else{
                //当有遮罩层时
                //不是第一种情况就只能是最大的了
                //console.log('可能弹窗元素就是：');
                // console.log(maybeele);
                modalele = maybeele;
                if(modalele.className == ''){
                        modalelestack.push(modalele);
                }else{
                        modalelestack.push(modalele.className);
                     }
                console.log(modalele)
                console.log('选的最大的被输出')
            }
        }
    }
    //主函数结束

    GetModal(document.querySelector('body'));
    try {
        for (let o = 0; o < frames.length; o++) {
            //其他frame里会有可能有遮罩层
            GetModal(window.frames[o].document.querySelector('body'));
        }
    } catch (e) {
        console.log(e.message);
    }
}//Ifrmodal函数结束



Ifrmodal();
console.log('遮罩层的数量：');
console.log(maskelestack.length);
for (let i = 0; i < maskelestack.length; i++) {
    console.log(i+1);
    if(typeof maskelestack[i]=='object'){
        console.log(maskelestack[i]);
                    }
    if(typeof maskelestack[i]=='string'){
        console.log(document.querySelector('.'+maskelestack[i].split(' ')[0]));
                    }
    multimodalstack.push(maskelestack[i]);//加到总的集合中
}
console.log('弹窗层的数量：')
console.log(modalelestack.length);
for (let i = 0; i < maskelestack.length; i++) {
    console.log(i+1);
    if(typeof modalelestack[i]=='object'){
        console.log(modalelestack[i]);
		insideallshould(modalelestack[i])
        modalelestack[i].focus()
		nowpop = modalelestack[i];
                    }
    if(typeof modalelestack[i]=='string'){
        console.log(document.querySelector('.'+modalelestack[i].split(' ')[0]));
		insideallshould(document.querySelector('.'+modalelestack[i].split(' ')[0]))
        document.querySelector('.'+modalelestack[i].split(' ')[0]).focus();
        nowpop = document.querySelector('.'+modalelestack[i].split(' ')[0]);
                    }
    multimodalstack.push(modalelestack[i]);//加入总集
}
//window.alert(multimodalstack.length);
}








function getnowfocus() {//获得当前具有焦点的元素
    return document.activeElement;
}

function Belongfa(ele1,ele2) {//两个元素之间是否有从属关系,先儿子后爹
    if(ele1 == null&& ele2==null) return false;
    if(typeof ele1!="object" ||typeof ele2!="object"){
        return false;
    }
    var temp1 = ele1;
    var temp2 = ele2;
    while (temp1 != document.body){
        if(temp1 == ele2){
            return true;
        }else{
            temp1 = temp1.parentElement;
        }
    }

    return false;
}


function attentionfocus() {//获得焦点
    function getnowfocus() {
    console.log(document.activeElement);
    }
    var t =setInterval(getnowfocus,500);
    function stopfocus() {
    clearInterval(t);
    }
}

function addfocusable(element) {//使元素可能被聚焦
    if(element.tabIndex>"-1"){
        console.log(element.tabIndex);
    }else{
        element.tabIndex = '0';
        console.log('已经更改为：')
        console.log(element.tabIndex);
    }
}




function Sonword(element) {//是否所有元素含字，且长度小于总体大小

        let stackson = [];
        let sum = 0;
		stackson = Array.from(element.children);//伪数组数组化
        if(stackson.length ==0||typeof element.innerText != 'string'){
            return false;
        }
        if(typeof element.value == 'string'){
        var reg = new RegExp(' ','g');//去除可能产生的无效字符
        var reg2 = new RegExp('\n','g');
        var word = (element.innerText + element.value).replace(reg,"").replace(reg2,"");
        sum = word.length;
        }else{
            var reg1 = new RegExp(' ','g');
            var reg12 = new RegExp('\n','g');
            var word1 = (element.innerText).replace(reg1,"").replace(reg12,"");
            sum = word1.length;
        }
        let sonsum = 0;
        if( sum != 0){
    		  for(let i=stackson.length-1;i>-1;i--){
                if(typeof stackson[i].value == 'string'&& typeof stackson[i].innerText == 'string'){
                  sonsum += (stackson[i].innerText + stackson[i].value).length;
                }else if(typeof stackson[i].innerText == 'string'){
                  sonsum += stackson[i].innerText.length;
                  }else if(typeof stackson[i].value == 'string'){
                       sonsum += stackson[i].value.length;
                  }else{
                      continue;
                  }
          }
	   }
       return sum>sonsum;
}


function insideallshould(element){//元素内按理应可聚焦元素
    element.tabIndex = 0;
    let stack= [];
    let waitstack =[];//等待可聚焦的集合
    let istack = [];//I标签的集合
    stack.push(element);
   while(stack.length!=0){
	 let temp = stack.pop();
     let may = false;
     let stackson = [];
	 stackson = Array.from(temp.children);//伪数组数组化
       if(stackson.length>1){
           for(let i=stackson.length-1;i>-1;i--){
			if(stackson[i].tagName == "LABEL"){
                may = true;
            }
		  }
       }
     if((Sonword(temp)&&Sonnotfatherword(temp))||(may)){//让连续的文字元素块可聚焦
            if(typeof temp.value == 'string'){
           if(temp.type != 'hidden'){
              if((temp.innerText + temp.value).length != 0){
              console.log(temp)
              console.log(temp.tabIndex)
              temp.tabIndex = 0;
              }
           }
          }else{
           if(temp.innerText.length != 0){
              console.log(temp)
              console.log(temp.tabIndex)
              temp.tabIndex = 0;
           }
        }
       }else if(simplewordele(temp) && temp.parentElement.tabIndex!=0&&temp.tagName!='LABEL'){//让单独文字块就可聚焦
           console.log(temp)
           console.log(temp.tabIndex)
           temp.tabIndex = 0;
       }
       if( temp.tagName!="P"&&temp.target!='_blank'
                &&typeof temp.innerText=='string'&& temp.innerText.length <2
          && (window.getComputedStyle(temp).background).indexOf('url') != -1){//让“x”部件可聚焦
         //这里要求要可点击元素，但暂时没有可用的，因此用差的方法
            temp.tabIndex = 0;
            waitstack.push(temp);
            console.log(temp)
            temp.ariaLabel = "可点击 图标";
        }
       if(temp.tagName=="I"){
		   istack.push(temp);
           console.log(temp)
	    }

		if(stackson.length==0){
			continue;
		}else{
		for(let i=stackson.length-1;i>-1;i--){
			stack.push(stackson[i]);
		  }
		}
   }
    let tempx = -100;
    let tempy = 9999;
    let maybeclose;
    if(waitstack.length==1){
        maybeclose = waitstack[0];
    }
    if (waitstack.length == 0 && istack.length!=0){//一般的情况不满足，就找i图标的
        console.log('i图标')
		for(let i=0;i<istack.length;i++){
		console.log(istack[i])
		     if(tempx-tempy > istack[i].getBoundingClientRect().x-istack[i].getBoundingClientRect().y){
		        continue;
		    }else {
	        tempx = istack[i].getBoundingClientRect().x;
	        tempy = istack[i].getBoundingClientRect().y;
	        maybeclose = istack[i];
		    }
		}
	}else if (waitstack.length != 0){//一般情况
        console.log('一般情况')
		for(let i=0;i<waitstack.length;i++){
		console.log(waitstack[i])
	     if(tempx-tempy > waitstack[i].getBoundingClientRect().x-waitstack[i].getBoundingClientRect().y){
	        continue;
	    }else {
	        tempx = waitstack[i].getBoundingClientRect().x;
	        tempy = waitstack[i].getBoundingClientRect().y;
	        maybeclose = waitstack[i];
	    }
	  }
	}else if(waitstack.length+ istack.length == 0){//所有情况都不是的话，就找右上角
        console.log('右上角')
		 let stack =[];
		let tempx = -100;
       let tempy = 9999;
		let rightestele;
		 stack.push(element);
    while(stack.length!=0){
		let temp = stack.pop();
       	   if(tempx-tempy > temp.getBoundingClientRect().x-temp.getBoundingClientRect().y){
	       }else {
	        tempx = temp.getBoundingClientRect().x;
	        tempy = temp.getBoundingClientRect().y;
	        rightestele = temp;
	    }
     let stackson = [];
		stackson = Array.from(temp.children);//伪数组数组化
		if(stackson.length==0){
			continue;
		}else{
		for(let i=stackson.length-1;i>-1;i--){
			stack.push(stackson[i]);
		  }
		}
      }
		maybeclose = rightestele;
	}

    console.log(maybeclose);
    console.log("关闭弹窗");
    maybeclose.ariaLabel = "关闭弹窗";
}

function Sonnotfatherword(element) {//其子元素无其他元素满足条件（子元素含字，但子元素长度小于总长度）
	let stack= [];
    stack.push(element);
    while(stack.length!=0){
		let temp = stack.pop();
		if(temp != element){
			if(Sonword(temp)){
				return false;
			}
		}
        let stackson = [];
		stackson = Array.from(temp.children);//伪数组数组化
		if(stackson.length==0){
			continue;
		}else{
		for(let i=stackson.length-1;i>-1;i--){
			stack.push(stackson[i]);
		  }
		}
    }
	return true;
}
function clickableele(ele){
    return eleisclick(ele)||anotherclick(ele)
}
function anotherclick(ele){
	if(typeof $._data(ele,"events")!='undefined'&& $._data(ele,"events").click!=null){
		return true;
	}else if(typeof $(ele).data("events")!='undefined'&& $(ele).data("events").click!=null){
        return true;
    }else{
		return false;
	}

}

function eleisclick(ele) {
	if(ele.onclick!=null){
		return true;
	}
	if(typeof ele.href!= 'undefined'&& typeof ele.target!= 'undefined'){
		return true;
	}
	return false;
}

function simplewordele(ele) {//含字元素且是单独元素无孩子节点
    if(typeof ele.innerText!='string'){
        return false;
    }
    if(ele.innerText.length !=0 && ele.children.length == 0){
        return true;
    }else{
        return false;
    }
}
function computeLPSArray(pattern) {
  const m = pattern.length;
  const lps = Array(m).fill(0);

  let len = 0;
  let i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

function KMPSearch(text, pattern) {//KMP文本匹配
  const n = text.length;
  const m = pattern.length;

  const lps = computeLPSArray(pattern);

  let i = 0;
  let j = 0;
  while (i < n) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === m) {
      return i - j;
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return -1;
}


function run(){
    runtest(document.querySelector('body'));
}
//到弹窗检测模块是弹窗后续处理模块


window.onload = function(){
   setInterval(run,1200);//运行程序
}



